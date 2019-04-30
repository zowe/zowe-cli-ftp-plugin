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
let testDataSet: string;

let testEnvironment: ITestEnvironment;
describe("delete data set command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_delete_data_set",
            installPlugin: true
        });
        expect(testEnvironment).toBeDefined();
        connection = await FTPConfig.connectFromArguments(testEnvironment.systemTestProperties.zosftp);
        user = testEnvironment.systemTestProperties.zosftp.user.trim().toUpperCase();
        testDataSet = testEnvironment.systemTestProperties.datasets.writablePDS;
    });

    afterAll(async () => {
        connection.close();
        await TestEnvironment.cleanUp(testEnvironment);
    });

    it("should display upload file to data set help", () => {
        const shellScript = path.join(__dirname, "__scripts__", "delete_data_set_help.sh");
        const response = runCliScript(shellScript, testEnvironment);

        expect(response.stderr.toString()).toBe("");
        expect(response.status).toBe(0);
        expect(response.stdout.toString()).toMatchSnapshot();
    });

    it("should be able to delete a freshly uploaded member to the writable data set from the properties file", async () => {
        const memberSuffixLength = 6;
        const destination = testDataSet + "(R" + generateRandomAlphaNumericString(memberSuffixLength) + ")";
        const randomContentLength = 60;
        await connection.uploadDataset(generateRandomAlphaNumericString(randomContentLength), "'" + destination + "'", "ascii");
        const result = runCliScript(__dirname + "/__scripts__/command/command_delete_data_set.sh", testEnvironment,
            [destination]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.stdout.toString()).toContain("deleted");
    });

    it("should give a syntax error if the file and data set are omitted", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command/command_delete_data_set.sh", testEnvironment, []);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Positional");
        expect(stderr).toContain("dataSet");
        expect(stderr).toContain("Syntax");
        expect(result.status).toEqual(1);
    });
});
