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
import { generateRandomAlphaNumericString, runCliScript } from "../../../../__src__/TestUtils";
import * as path from "path";

let user: string;
let connection: any;
let ussTestDir: string;

let testEnvironment: ITestEnvironment;
describe("delete uss file command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_delete_uss_file",
            installPlugin: true
        });
        expect(testEnvironment).toBeDefined();
        connection = await FTPConfig.connectFromArguments(testEnvironment.systemTestProperties.zosftp);
        user = testEnvironment.systemTestProperties.zosftp.user.trim().toUpperCase();
        ussTestDir = testEnvironment.systemTestProperties.uss.ussTestDirectory;
    });

    afterAll(async () => {
        connection.close();
        await TestEnvironment.cleanUp(testEnvironment);
    });

    it("should display delete uss file help", () => {
        const shellScript = path.join(__dirname, "__scripts__", "delete_uss_file_help.sh");
        const response = runCliScript(shellScript, testEnvironment);

        expect(response.stderr.toString()).toBe("");
        expect(response.status).toBe(0);
        expect(response.stdout.toString()).toMatchSnapshot();
    });

    it("should be able to upload a file to a uss directory then delete it", async () => {
        const CONTENT_LENGTH = 60;
        const fileNameLength = 30;
        const destination = ussTestDir + "/" + generateRandomAlphaNumericString(fileNameLength) + ".txt";
        const uploadContent = generateRandomAlphaNumericString(CONTENT_LENGTH);
        await connection.uploadDataset(uploadContent, destination, "ascii");
        const result = runCliScript(__dirname + "/__scripts__/command/command_delete_uss_file.sh", testEnvironment,
            [destination]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.stdout.toString()).toContain("Successfully deleted USS file");
        expect(result.status).toEqual(0);
        });

    it("should give a syntax error if the uss file is omitted", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command/command_delete_uss_file.sh", testEnvironment, []);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Positional");
        expect(stderr).toContain("uss");
        expect(stderr).toContain("file");
        expect(stderr).toContain("Syntax");
        expect(result.status).toEqual(1);
    });
});
