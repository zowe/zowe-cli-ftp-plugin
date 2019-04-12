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
import { IO } from "@zowe/imperative";
import * as fs from "fs";

let user: string;
let connection: any;
let testDataSet: string;

let testEnvironment: ITestEnvironment;

describe("upload stdin to data set command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_upload_stdin_to_data_set",
            installPlugin: true
        });
        expect(testEnvironment).toBeDefined();
        connection = await FTPConfig.connectFromProfile(testEnvironment.systemTestProperties.zosftp);
        user = testEnvironment.systemTestProperties.zosftp.user.trim().toUpperCase();

        testDataSet = testEnvironment.systemTestProperties.datasets.writablePDS;
    });

    afterAll(async () => {
        connection.close();
        await TestEnvironment.cleanUp(testEnvironment);
    });

    it("should display upload stdin to data set help", () => {
        const shellScript = path.join(__dirname, "__scripts__", "upload_stdin_to_data_set_help.sh");
        const response = runCliScript(shellScript, testEnvironment);

        expect(response.stderr.toString()).toBe("");
        expect(response.status).toBe(0);
        expect(response.stdout.toString()).toMatchSnapshot();
    });

    it("should be able to upload stdin to a data set and verify that the content is correct", async () => {
        const fileToUpload = __dirname + "/resources/file.txt";
        const memberSuffixLength = 6;
        const destination = testDataSet + "(R" + generateRandomAlphaNumericString(memberSuffixLength) + ")";
        const result = runCliScript(__dirname + "/__scripts__/command/command_upload_stdin_to_data_set.sh", testEnvironment,
            [fileToUpload, destination]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        const uploadedContent = (await connection.getDataset("'" + destination + "'")).toString().trim();
        const expectedContent = IO.readFileSync(fileToUpload).toString().trim();
        const uploadedLines = uploadedContent.split(/\r?\n/g);
        const expectedLines = expectedContent.split(/\r?\n/g);
        for (let x = 0; x < expectedLines.length; x++) {
            expect(uploadedLines[x].trim()).toEqual(expectedLines[x].trim());
        }
        await connection.deleteDataset(destination);
    });

    it("should be able to upload stdin to a data set in binary mode and verify that the content is correct", async () => {
        const fileToUpload = testEnvironment.workingDir + "/binary.bin";
        const randomContentLength = 60;
        const randomContent = await generateRandomBytes(randomContentLength);
        const memberSuffixLength = 6;
        fs.writeFileSync(fileToUpload, randomContent);
        const destination = testDataSet + "(R" + generateRandomAlphaNumericString(memberSuffixLength) + ")";
        const result = runCliScript(__dirname + "/__scripts__/command/command_upload_stdin_to_data_set_binary.sh", testEnvironment,
            [fileToUpload, destination]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        const uploadedContent = (await connection.getDataset("'" + destination + "'", "binary"));
        // binary upload to a fixed record  data set will fill a data set with zeroes for the remainder of the record
        // so we can trim the zeroes off and still be accurate
        const uploadedContentString = uploadedContent.toString("hex").replace(/0+$/, "");
        expect(uploadedContentString).toEqual(randomContent.toString("hex").replace(/0+$/, ""));
        await connection.deleteDataset(destination);
    });

    it("should give a syntax error if the data set name is omitted", () => {
        const fileToUpload = __dirname + "/resources/file.txt";
        const result = runCliScript(__dirname + "/__scripts__/command/command_upload_stdin_to_data_set.sh", testEnvironment, [fileToUpload]);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Positional");
        expect(stderr).toContain("data");
        expect(stderr).toContain("set");
        expect(stderr).toContain("Syntax");
        expect(result.status).toEqual(1);
    });
});
