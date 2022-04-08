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

import { ITestEnvironment, TestEnvironment, runCliScript } from "@zowe/cli-test-utils";
import { ITestPropertiesSchema } from "../../../../__src__/doc/ITestPropertiesSchema";
import { FTPConfig } from "../../../../../src/api/FTPConfig";
import { generateRandomAlphaNumericString, generateRandomBytes } from "../../../../__src__/TestUtils";
import * as path from "path";

let user: string;
let connection: any;
let ussTestDir: string;
let ussTestDirLink: string;
let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;

describe("view uss file command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_view_uss_file",
            installPlugin: true
        });
        expect(testEnvironment).toBeDefined();
        connection = await FTPConfig.connectFromArguments(testEnvironment.systemTestProperties.zftp);
        user = testEnvironment.systemTestProperties.zftp.user.trim().toUpperCase();
        ussTestDir = testEnvironment.systemTestProperties.uss.ussTestDirectory;
        ussTestDirLink = testEnvironment.systemTestProperties.uss.ussTestDirectoryLink;
    });

    afterAll(async () => {
        connection.close();
        await TestEnvironment.cleanUp(testEnvironment);
    });

    it("should display view uss file help", () => {
        const shellScript = path.join(__dirname, "__scripts__", "view_uss_file_help.sh");
        const response = runCliScript(shellScript, testEnvironment);

        expect(response.stderr.toString()).toBe("");
        expect(response.status).toBe(0);
        expect(response.stdout.toString()).toMatchSnapshot();
    });

    it("should be able to upload a file to a uss directory then view it", async () => {
        const CONTENT_LENGTH = 60;
        const fileNameLength = 30;
        const destination = ussTestDir + "/" + generateRandomAlphaNumericString(fileNameLength) + ".txt";
        const uploadContent = generateRandomAlphaNumericString(CONTENT_LENGTH);
        await connection.uploadDataset(uploadContent, destination, "ascii");
        const result = runCliScript(__dirname + "/__scripts__/command/command_view_uss_file.sh", testEnvironment,
            [destination]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.stdout.toString()).toContain(uploadContent);
        expect(result.status).toEqual(0);
    });

    it("should be able to upload a file to a uss directory then view it from the directory symbolic link", async () => {
        const CONTENT_LENGTH = 60;
        const fileNameLength = 30;
        const fileName = generateRandomAlphaNumericString(fileNameLength) + ".txt";
        const destination = ussTestDir + "/" + fileName;
        const destinationWithLink = ussTestDirLink + "/" + fileName;

        const uploadContent = generateRandomAlphaNumericString(CONTENT_LENGTH);
        await connection.uploadDataset(uploadContent, destination, "ascii");
        const result = runCliScript(__dirname + "/__scripts__/command/command_view_uss_file.sh", testEnvironment,
            [destinationWithLink]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.stdout.toString()).toContain(uploadContent);
        expect(result.status).toEqual(0);
    });

    it("should be able to upload to a uss file in binary mode, then view the content with the CLI and verify that the content is correct",
        async () => {
            const fileToUpload = testEnvironment.workingDir + "/binary.bin";
            const randomContentLength = 6000;
            const randomContent = await generateRandomBytes(randomContentLength);
            const fileNameLength = 30;
            const destination = ussTestDir + "/" + generateRandomAlphaNumericString(fileNameLength) + ".bin";
            await connection.uploadDataset(randomContent, destination, "binary");
            const result = runCliScript(__dirname + "/__scripts__/command/command_view_uss_file_binary.sh", testEnvironment,
                [destination]);
            expect(result.stderr.toString()).toEqual("");
            expect(result.status).toEqual(0);
            const uploadedContent = (await connection.getDataset(destination, "binary"));
            const uploadedContentString = uploadedContent.toString("hex");
            expect(uploadedContentString).toEqual(randomContent.toString("hex"));
            await connection.deleteDataset(destination);
        });

    it("should give a syntax error if the uss file is omitted", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command/command_view_uss_file.sh", testEnvironment, []);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Positional");
        expect(stderr).toContain("uss");
        expect(stderr).toContain("file");
        expect(stderr).toContain("Syntax");
        expect(result.status).toEqual(1);
    });
});
