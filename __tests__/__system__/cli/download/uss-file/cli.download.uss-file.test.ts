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
import { IO } from "@zowe/imperative";

let connection: any;
let ussTestDir: string;
let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;

describe("submit job from local file command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_ftp_download_uss",
            installPlugin: true
        });
        expect(testEnvironment).toBeDefined();
        connection = await FTPConfig.connectFromArguments(testEnvironment.systemTestProperties.zftp);
        ussTestDir = testEnvironment.systemTestProperties.uss.ussTestDirectory;
    });

    afterAll(async () => {
        connection.close();
        await TestEnvironment.cleanUp(testEnvironment);
    });

    it("should be able to download a uss file to a local file in text mode and verify the content", async () => {
        const CONTENT_LENGTH = 60;
        const fileNameLength = 30;
        const destination = ussTestDir + "/" + generateRandomAlphaNumericString(fileNameLength) + ".txt";
        const uploadContent = generateRandomAlphaNumericString(CONTENT_LENGTH);
        await connection.uploadDataset(uploadContent, destination, "ascii");
        const downloadFilePath = testEnvironment.workingDir + "/uss.txt";
        const result = runCliScript(__dirname + "/__scripts__/command_download_uss_file.sh", testEnvironment,
            [destination, downloadFilePath]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(IO.existsSync(downloadFilePath)).toBe(true);
        const downloadedContent = IO.readFileSync(downloadFilePath);
        expect(downloadedContent.toString()).toContain(uploadContent);
        IO.deleteFile(downloadFilePath);
    });

    it("should be able to download a USS file to a  local file in binary mode and verify the content", async () => {
        const randomContentLength = 6000;
        const randomContent = await generateRandomBytes(randomContentLength);
        const fileNameLength = 30;
        const destination = ussTestDir + "/" + generateRandomAlphaNumericString(fileNameLength) + ".bin";
        await connection.uploadDataset(randomContent, destination, "binary");
        const downloadFilePath = testEnvironment.workingDir + "/iefbr14.txt";
        const result = runCliScript(__dirname + "/__scripts__/command_download_uss_file_binary.sh", testEnvironment,
            [destination, downloadFilePath]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(IO.existsSync(downloadFilePath)).toBe(true);
        const uploadedContent = IO.readFileSync(downloadFilePath, undefined, true);
        const uploadedContentString = uploadedContent.toString("hex");
        expect(uploadedContentString).toEqual(randomContent.toString("hex"));
        await connection.deleteDataset(destination);
    });

    it("should give a syntax error if the USS file name is omitted", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command_download_uss_file.sh", testEnvironment,
            ["", testEnvironment.workingDir + "/myfile.txt"]);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Positional");
        expect(stderr).toContain("file");
        expect(stderr).toContain("USS");
        expect(stderr).toContain("Syntax");
        expect(result.status).toEqual(1);
    });
});
