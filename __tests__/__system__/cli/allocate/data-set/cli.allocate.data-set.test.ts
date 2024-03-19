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

let connection: ZosAccessor;
let dsnPrefix: string;
let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;

describe("allocate data set command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_allocate_data_set",
            installPlugin: true
        });
        expect(testEnvironment).toBeDefined();
        connection = await FTPConfig.connectFromArguments(testEnvironment.systemTestProperties.zftp);
        dsnPrefix = testEnvironment.systemTestProperties.datasets.dsnPrefix;
    });

    afterAll(async () => {
        connection.close();
        await TestEnvironment.cleanUp(testEnvironment);
    });

    it("should be able to allocate a sequential data set with default attributes", async () => {
        const memberSuffixLength = 6;
        const destination = dsnPrefix + ".S" + generateRandomAlphaNumericString(memberSuffixLength);
        const result = runCliScript(__dirname + "/__scripts__/command_allocate_data_set.sh", testEnvironment,
            [destination]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.stdout.toString()).toContain('Allocated dataset ' + destination + ' successfully!');
    });

    it("should be able to allocate a partitioned data set with dcb options", async () => {
        const memberSuffixLength = 6;
        const destination = dsnPrefix + ".S" + generateRandomAlphaNumericString(memberSuffixLength);
        const dcb = "LRECL=100 RECFM=FB DSORG=PO PRIMARY=10 SECONDARY=20 DIRECTORY=10";
        const result = runCliScript(__dirname + "/__scripts__/command_allocate_data_set_dcb.sh", testEnvironment,
            [destination, dcb]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.stdout.toString()).toContain('Allocated dataset ' + destination + ' successfully!');

        const attributes = await connection.listDatasets(destination);
        expect(attributes[0].dsOrg).toEqual("PO");
        expect(attributes[0].recordLength).toEqual(100);
        expect(attributes[0].recordFormat).toEqual("FB");
    });

    it("should give a syntax error if the data set are omitted", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command_allocate_data_set.sh", testEnvironment, []);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Syntax Error");
        expect(stderr).toContain("Missing Positional Argument: datasetName");
        expect(result.status).toEqual(1);
    });
});
