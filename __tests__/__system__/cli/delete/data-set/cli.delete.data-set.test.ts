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
let testDataSet: string;
let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;

describe("delete data set command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_delete_data_set",
            installPlugin: true
        });
        expect(testEnvironment).toBeDefined();
        connection = await FTPConfig.connectFromArguments(testEnvironment.systemTestProperties.zftp);
        testDataSet = testEnvironment.systemTestProperties.datasets.writablePDS;
    });

    afterAll(async () => {
        connection.close();
        await TestEnvironment.cleanUp(testEnvironment);
    });

    it("should be able to delete a freshly uploaded member to the writable data set from the properties file", async () => {
        const memberSuffixLength = 6;
        const destination = testDataSet + "(R" + generateRandomAlphaNumericString(memberSuffixLength) + ")";
        const randomContentLength = 60;
        await connection.uploadDataset(generateRandomAlphaNumericString(randomContentLength), "'" + destination + "'", ITransferMode.ASCII);
        const result = runCliScript(__dirname + "/__scripts__/command_delete_data_set.sh", testEnvironment,
            [destination]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.stdout.toString()).toContain("deleted");
    });

    it("should give a syntax error if the file and data set are omitted", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command_delete_data_set.sh", testEnvironment, []);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Positional");
        expect(stderr).toContain("dataSet");
        expect(stderr).toContain("Syntax");
        expect(result.status).toEqual(1);
    });
});
