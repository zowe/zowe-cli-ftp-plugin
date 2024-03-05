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
import * as path from "path";
import { ZosAccessor } from "zos-node-accessor";
import { ITransferMode } from "../../../../../src/api";

let connection: ZosAccessor;
let ussTestDir: string;
let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;

describe("list data-set-classic ftp command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_list_uss",
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

    it("should be able to upload a file to the test directory and be show that newly uploaded file in the list", async () => {
        const CONTENT_LENGTH = 60;
        const fileNameLength = 30;
        const destination = ussTestDir + "/" + generateRandomAlphaNumericString(fileNameLength) + ".txt";
        const uploadContent = generateRandomAlphaNumericString(CONTENT_LENGTH);
        await connection.uploadFile(uploadContent, destination, ITransferMode.ASCII); // upload the USS file
        const result = runCliScript(__dirname + "/__scripts__/command_list_uss_files.sh", testEnvironment, [ussTestDir]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.stdout.toString()).toContain(path.basename(destination));
        await connection.deleteFile(destination);
    });

    it("should be able to upload a file to the test directory and be show that newly uploaded file with pattern in the list", async () => {
        const CONTENT_LENGTH = 60;
        const fileNameLength = 30;
        const fileName = generateRandomAlphaNumericString(fileNameLength);
        const destination = ussTestDir + "/" + "prefix_" + fileName + "_suffix.txt";
        const uploadContent = generateRandomAlphaNumericString(CONTENT_LENGTH);
        await connection.uploadFile(uploadContent, destination, ITransferMode.ASCII); // upload the USS file

        const ussTestDirPattern1 = ussTestDir + "/" + "prefix_*";
        let result = runCliScript(__dirname + "/__scripts__/command_list_uss_files.sh", testEnvironment, [ussTestDirPattern1]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.stdout.toString()).toContain(path.basename(destination));

        const ussTestDirPattern2 = ussTestDir + "/" + "*.txt";
        result = runCliScript(__dirname + "/__scripts__/command_list_uss_files.sh", testEnvironment, [ussTestDirPattern2]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.stdout.toString()).toContain(path.basename(destination));

        const ussTestDirPattern3 = ussTestDir + "/" + "prefix_*.txt";
        result = runCliScript(__dirname + "/__scripts__/command_list_uss_files.sh", testEnvironment, [ussTestDirPattern3]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.stdout.toString()).toContain(path.basename(destination));

        const ussTestDirPattern4 = ussTestDir + "/" + "bad_prefix_*";
        result = runCliScript(__dirname + "/__scripts__/command_list_uss_files.sh", testEnvironment, [ussTestDirPattern4]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.stdout.toString()).not.toContain(path.basename(destination));
        await connection.deleteFile(destination);
    });

    it("should give a syntax error if the uss file pattern is omitted", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command_list_uss_files.sh", testEnvironment, []);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Positional");
        expect(stderr).toContain("directory");
        expect(stderr).toContain("Syntax");
        expect(result.status).toEqual(1);
    });
});
