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

let connection: any;
let ussTestDir: string;
let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;

describe("rename uss file command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_rename_uss_file",
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

    it("should be able to upload a file to a uss directory then rename", async () => {
        const CONTENT_LENGTH = 60;
        const fileNameLength = 30;
        const destination = ussTestDir + "/" + generateRandomAlphaNumericString(fileNameLength) + ".txt";
        const uploadContent = generateRandomAlphaNumericString(CONTENT_LENGTH);
        await connection.uploadDataset(uploadContent, destination, "ascii"); // upload the USS file
        const renameDestination = ussTestDir + "/" + generateRandomAlphaNumericString(fileNameLength) + ".txt";
        const result = runCliScript(__dirname + "/__scripts__/command_rename_uss_file.sh", testEnvironment,
            [destination, renameDestination]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.stdout.toString()).toContain("renamed");
        expect(result.stdout.toString()).toContain("Success");
        expect(result.status).toEqual(0);
        const renamedContent = (await connection.getDataset(renameDestination)).toString();
        expect(renamedContent.trim()).toEqual(uploadContent);
        await connection.deleteDataset(renameDestination);
    });

    it("should give a syntax error if the uss file is omitted", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command_rename_uss_file.sh", testEnvironment, []);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Positional");
        expect(stderr).toContain("uss");
        expect(stderr).toContain("file");
        expect(stderr).toContain("Syntax");
        expect(result.status).toEqual(1);
    });
});
