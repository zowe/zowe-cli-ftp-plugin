/*
 * This program and the accompanying materials are made available under the terms of the
 * Eclipse Public License v2.0 which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-v20.html
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Copyright Contributors to the Zowe Project.
 *
 */

import { ITestEnvironment } from "../../../../__src__/environment/doc/response/ITestEnvironment";
import { FTPConfig } from "../../../../../src/api/FTPConfig";
import { TestEnvironment } from "../../../../__src__/environment/TestEnvironment";
import { generateRandomAlphaNumericString, generateRandomBytes, runCliScript } from "../../../../__src__/TestUtils";
import * as path from "path";
import { IO } from "@brightside/imperative";
import * as fs from "fs";

let user: string;
let connection: any;
let ussTestDir: string;

let testEnvironment: ITestEnvironment;
describe("upload stdin to uss file command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_upload_stdin_to_uss_file",
            installPlugin: true
        });
        expect(testEnvironment).toBeDefined();
        connection = await FTPConfig.connectFromProfile(testEnvironment.systemTestProperties.zosftp);
        user = testEnvironment.systemTestProperties.zosftp.user.trim().toUpperCase();
        ussTestDir = testEnvironment.systemTestProperties.uss.ussTestDirectory;
    });

    afterAll(async () => {
        connection.close();
        await TestEnvironment.cleanUp(testEnvironment);
    });

    it("should display upload stdin to uss file help", () => {
        const shellScript = path.join(__dirname, "__scripts__", "upload_stdin_to_uss_file_help.sh");
        const response = runCliScript(shellScript, testEnvironment);

        expect(response.stderr.toString()).toBe("");
        expect(response.status).toBe(0);
        expect(response.stdout.toString()).toMatchSnapshot();
    });

    it("should be able to upload stdin to a uss directory and verify that the file exists and contains the right content", async () => {
        const fileToUpload = __dirname + "/resources/file.txt";
        const fileNameLength = 30;
        const destination = ussTestDir + "/" + generateRandomAlphaNumericString(fileNameLength) + ".txt";
        const result = runCliScript(__dirname + "/__scripts__/command/command_upload_stdin_to_uss_file.sh", testEnvironment,
            [fileToUpload, destination]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        const uploadedContent = (await connection.getDataset(destination)).toString().trim();
        const expectedContent = IO.readFileSync(fileToUpload).toString().trim();
        expect(uploadedContent).toEqual(expectedContent);
        await connection.deleteDataset(destination);
    });

    it("should be able to upload stdin to a data set in binary mode and verify that the content is correct", async () => {
        const fileToUpload = testEnvironment.workingDir + "/binary.bin";
        const randomContentLength = 60;
        const randomContent = await generateRandomBytes(randomContentLength);
        const fileNameLength = 30;
        fs.writeFileSync(fileToUpload, randomContent);
        const destination = ussTestDir + "/" + generateRandomAlphaNumericString(fileNameLength) + ".bin";
        const result = runCliScript(__dirname + "/__scripts__/command/command_upload_stdin_to_uss_file_binary.sh", testEnvironment,
            [fileToUpload, destination]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        const uploadedContent = (await connection.getDataset(destination, "binary"));
        const uploadedContentString = uploadedContent.toString("hex");
        expect(uploadedContentString).toEqual(randomContent.toString("hex"));
        await connection.deleteDataset(destination);
    });

    it("should give a syntax error if the uss file is omitted", async () => {
        const fileToUpload = __dirname + "/resources/file.txt";
        const result = runCliScript(__dirname + "/__scripts__/command/command_upload_stdin_to_uss_file.sh", testEnvironment, [fileToUpload]);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Positional");
        expect(stderr).toContain("uss");
        expect(stderr).toContain("file");
        expect(stderr).toContain("Syntax");
        expect(result.status).toEqual(1);
    });
});
