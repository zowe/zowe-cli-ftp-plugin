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
import { generateRandomAlphaNumericString } from "../../../../__src__/TestUtils";
import { ZosAccessor } from "zos-node-accessor";
import { ITransferMode } from "../../../../../src/api";

let connection: ZosAccessor;
let ussTestDir: string;
let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;

describe("delete uss file command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_delete_uss_file",
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

    it("should be able to upload a file to a uss directory then delete it", async () => {
        const CONTENT_LENGTH = 60;
        const fileNameLength = 30;
        const destination = ussTestDir + "/" + generateRandomAlphaNumericString(fileNameLength) + ".txt";
        const uploadContent = generateRandomAlphaNumericString(CONTENT_LENGTH);
        await connection.uploadDataset(uploadContent, destination, ITransferMode.ASCII);
        const result = runCliScript(__dirname + "/__scripts__/command_delete_uss_file.sh", testEnvironment,
            [destination]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.stdout.toString()).toContain("Successfully deleted USS file");
        expect(result.status).toEqual(0);
    });

    it("should be able to mkdir a directory on uss then delete it", async () => {
        const fileNameLength = 30;
        const destination = ussTestDir + "/" + generateRandomAlphaNumericString(fileNameLength);
        await connection.makeDirectory(destination);
        const result = runCliScript(__dirname + "/__scripts__/command_delete_uss_directory.sh", testEnvironment,
            [destination]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.stdout.toString()).toContain("Successfully deleted USS file");
        expect(result.status).toEqual(0);
    });

    it("should be able to mkdir a directory tree on uss then delete them recursively", async () => {
        const CONTENT_LENGTH = 60;
        const fileNameLength = 10;

        // destination
        // destination/file
        // destination/subDirectoryDestination1
        // destination/subDirectoryDestination1/file1
        // destination/subDirectoryDestination2
        // destination/subDirectoryDestination2/file2
        const destination = ussTestDir + "/" + generateRandomAlphaNumericString(fileNameLength);
        await connection.makeDirectory(destination);

        let uploadContent = generateRandomAlphaNumericString(CONTENT_LENGTH);
        const file = destination + "/" + generateRandomAlphaNumericString(fileNameLength) + ".txt";
        await connection.uploadDataset(uploadContent, file, ITransferMode.ASCII);

        const subDirectoryDestination1 = destination + "/" + generateRandomAlphaNumericString(fileNameLength);
        await connection.makeDirectory(subDirectoryDestination1);

        const subDirectoryDestination2 = destination + "/" + generateRandomAlphaNumericString(fileNameLength);
        await connection.makeDirectory(subDirectoryDestination2);

        uploadContent = generateRandomAlphaNumericString(CONTENT_LENGTH);
        const file1 = subDirectoryDestination1 + "/" + generateRandomAlphaNumericString(fileNameLength) + ".txt";
        await connection.uploadDataset(uploadContent, file1, ITransferMode.ASCII);

        uploadContent = generateRandomAlphaNumericString(CONTENT_LENGTH);
        const file2 = subDirectoryDestination2 + "/" + generateRandomAlphaNumericString(fileNameLength) + ".txt";
        await connection.uploadDataset(uploadContent, file2, ITransferMode.ASCII);

        const result = runCliScript(__dirname + "/__scripts__/command_delete_uss_directory_recursively.sh", testEnvironment,
            [destination]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.stdout.toString()).toContain("Successfully deleted USS file");
        expect(result.status).toEqual(0);
    });

    it("should give a syntax error if the uss file is omitted", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command_delete_uss_file.sh", testEnvironment, []);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Positional");
        expect(stderr).toContain("uss");
        expect(stderr).toContain("file");
        expect(stderr).toContain("Syntax");
        expect(result.status).toEqual(1);
    });

    it("should give error if the uss file doesn't exist", async () => {
        const destination = "/not-exist-file";
        const result = runCliScript(__dirname + "/__scripts__/command_delete_uss_directory.sh", testEnvironment,
            [destination]);
        expect(result.stderr.toString()).toContain("does not exist");
        expect(result.status).toEqual(1);
    });

});
