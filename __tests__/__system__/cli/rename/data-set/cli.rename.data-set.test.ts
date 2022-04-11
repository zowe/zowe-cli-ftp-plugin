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
import { generateRandomAlphaNumericString, randomDsName } from "../../../../__src__/TestUtils";
import * as path from "path";
import { inspect } from "util";


let user: string;
let connection: any;
let testDataSet: string;
let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;

describe("rename data set command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_rename_data_set",
            installPlugin: true
        });
        expect(testEnvironment).toBeDefined();
        connection = await FTPConfig.connectFromArguments(testEnvironment.systemTestProperties.zftp);
        user = testEnvironment.systemTestProperties.zftp.user.trim().toUpperCase();

        testDataSet = testEnvironment.systemTestProperties.datasets.renamablePDS;
    });

    afterAll(async () => {
        connection.close();
        await TestEnvironment.cleanUp(testEnvironment);
    });

    it("should display rename data set help", () => {
        const shellScript = path.join(__dirname, "__scripts__", "rename_data_set_help.sh");
        const response = runCliScript(shellScript, testEnvironment);

        expect(response.stderr.toString()).toBe("");
        expect(response.status).toBe(0);
        expect(response.stdout.toString()).toMatchSnapshot();
    });

    it("should be able to upload a file to a data set member then rename the member", async () => {

        const iefbr14DataSet = testEnvironment.systemTestProperties.jobs.iefbr14Member.toUpperCase();
        const iefbr14Content = (await connection.getDataset(iefbr14DataSet)).toString();
        const memberSuffixLength = 6;
        const originalMember = testDataSet + "(R" + generateRandomAlphaNumericString(memberSuffixLength) + ")";
        await connection.uploadDataset(iefbr14Content, "'" + originalMember + "'", "ascii"); // upload the USS file
        const renameDestination = testDataSet + "(R" + generateRandomAlphaNumericString(memberSuffixLength) + ")";
        const result = runCliScript(__dirname + "/__scripts__/command/command_rename_data_set.sh", testEnvironment,
            [originalMember, renameDestination]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.stdout.toString()).toContain("renamed");
        expect(result.stdout.toString()).toContain("Success");
        expect(result.status).toEqual(0);
        const renamedContent = (await connection.getDataset("'" + renameDestination + "'")).toString();
        expect(renamedContent.trim()).toEqual(iefbr14Content.trim());
        await connection.deleteDataset(renameDestination);
    });

    it("should be able to rename an existing data set from the properties file", async () => {
        let renameDestination;
        let originalName;
        try {
            originalName = testEnvironment.systemTestProperties.datasets.renamablePDS;
            renameDestination = randomDsName(user, undefined, 2);
            const result = runCliScript(__dirname + "/__scripts__/command/command_rename_data_set.sh", testEnvironment,
                [originalName, renameDestination]);
            expect(result.stderr.toString()).toEqual("");
            expect(result.stdout.toString()).toContain("renamed");
            expect(result.stdout.toString()).toContain("Success");
            expect(result.status).toEqual(0);

            const renameDataSetListResults: any[] = await connection.listDataset(renameDestination);
            let renamedDataSet: any;
            for (const dataSet of renameDataSetListResults) {
                if (dataSet.Dsname === renameDestination.toUpperCase()) {
                    renamedDataSet = dataSet;
                    break;
                }
            }
            expect(renamedDataSet).toBeDefined();

            const resetNameResult = runCliScript(__dirname + "/__scripts__/command/command_rename_data_set.sh", testEnvironment,
                [renameDestination, originalName]);
            expect(resetNameResult.stderr.toString()).toEqual("");
            expect(resetNameResult.stdout.toString()).toContain("renamed");
            expect(resetNameResult.stdout.toString()).toContain("Success");
            expect(resetNameResult.status).toEqual(0);

            // make sure the original named data set exists
            const resetNameResults: any[] = await connection.listDataset(originalName);
            let resetDataset: any;
            for (const dataSet of resetNameResults) {
                if (dataSet.Dsname === originalName.toUpperCase()) {
                    resetDataset = dataSet;
                }
            }
            expect(resetDataset).toBeDefined();

        } catch (e) {
            throw new Error("Warning! Rename of data set from your custom_properties file did not succeed!\nAttempted to rename from '" + originalName
                + "' to '" + renameDestination + "'You may have to manually rename " +
                "or re-create the data set! Error encountered while renaming: \n" + inspect(e));
        }
    });

    it("should give a syntax error if the data set names are omitted", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command/command_rename_data_set.sh", testEnvironment, []);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Positional");
        expect(stderr).toContain("data");
        expect(stderr).toContain("set");
        expect(stderr).toContain("Syntax");
        expect(result.status).toEqual(1);
    });
});
