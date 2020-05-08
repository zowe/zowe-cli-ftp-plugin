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
describe("make uss directory command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_make_uss_directory",
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

    it("should display make uss directory help", () => {
        const shellScript = path.join(__dirname, "__scripts__", "make_uss_directory_help.sh");
        const response = runCliScript(shellScript, testEnvironment);

        expect(response.stderr.toString()).toBe("");
        expect(response.status).toBe(0);
        expect(response.stdout.toString()).toMatchSnapshot();
    });

    it("should be able to make a uss directory", async () => {
        const dirNameLength = 30;
        const destination = ussTestDir + "/" + generateRandomAlphaNumericString(dirNameLength);
        const result = runCliScript(__dirname + "/__scripts__/command/command_make_uss_directory.sh", testEnvironment,
            [destination]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
    });

    it("should give a syntax error if the uss directoey is omitted", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command/command_make_uss_directory.sh", testEnvironment, []);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Syntax Error");
        expect(stderr).toContain("Missing Positional Argument");
        expect(stderr).toContain("ussDirectory");
        expect(result.status).toEqual(1);
    });
});
