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
import { inspect } from "util";
import { prepareTestJclDataSet } from "../../PrepareTestJclDatasets";
import { TransferMode, ZosAccessor } from "zos-node-accessor";

let connection: ZosAccessor;
let user: string;
let testDataSet: string;
let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;
let iefbr14DataSet: string;

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

        const pds = testEnvironment.systemTestProperties.datasets.writablePDS;
        iefbr14DataSet = await prepareTestJclDataSet(connection, pds, "IEFBR14");
    });

    afterAll(async () => {
        connection?.close();
        await TestEnvironment.cleanUp(testEnvironment);
    });

    it("should be able to upload a file to a data set member then rename the member", async () => {
        const iefbr14Content = (await connection.downloadDataset(iefbr14DataSet)).toString();
        const memberSuffixLength = 6;
        const originalMember = testDataSet + "(R" + generateRandomAlphaNumericString(memberSuffixLength) + ")";
        await connection.uploadDataset(iefbr14Content, "'" + originalMember + "'", TransferMode.ASCII); // upload the USS file
        const renameDestination = testDataSet + "(R" + generateRandomAlphaNumericString(memberSuffixLength) + ")";
        const result = runCliScript(__dirname + "/__scripts__/command_rename_data_set.sh", testEnvironment,
            [originalMember, renameDestination]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.stdout.toString()).toContain("renamed");
        expect(result.stdout.toString()).toContain("Success");
        expect(result.status).toEqual(0);
        const renamedContent = (await connection.downloadDataset("'" + renameDestination + "'")).toString();
        expect(renamedContent.trim()).toEqual(iefbr14Content.trim());
        await connection.deleteDataset(renameDestination);
    });

    it("should be able to rename an existing data set from the properties file", async () => {
        let renameDestination;
        let originalName;
        try {
            originalName = testEnvironment.systemTestProperties.datasets.renamablePDS;
            renameDestination = randomDsName(user, undefined, 2);
            const result = runCliScript(__dirname + "/__scripts__/command_rename_data_set.sh", testEnvironment,
                [originalName, renameDestination]);
            expect(result.stderr.toString()).toEqual("");
            expect(result.stdout.toString()).toContain("renamed");
            expect(result.stdout.toString()).toContain("Success");
            expect(result.status).toEqual(0);

            const renameDataSetListResults: any[] = await connection.listDatasets(renameDestination);
            let renamedDataSet: any;
            for (const dataSet of renameDataSetListResults) {
                if (dataSet.name === renameDestination.toUpperCase()) {
                    renamedDataSet = dataSet;
                    break;
                }
            }
            expect(renamedDataSet).toBeDefined();

            const resetNameResult = runCliScript(__dirname + "/__scripts__/command_rename_data_set.sh", testEnvironment,
                [renameDestination, originalName]);
            expect(resetNameResult.stderr.toString()).toEqual("");
            expect(resetNameResult.stdout.toString()).toContain("renamed");
            expect(resetNameResult.stdout.toString()).toContain("Success");
            expect(resetNameResult.status).toEqual(0);

            // make sure the original named data set exists
            const resetNameResults: any[] = await connection.listDatasets(originalName);
            let resetDataset: any;
            for (const dataSet of resetNameResults) {
                if (dataSet.name === originalName.toUpperCase()) {
                    resetDataset = dataSet;
                }
            }
            expect(resetDataset).toBeDefined();

        } catch (e) {
            throw new Error("Warning! Rename of data set from your custom_properties file did not succeed!\nAttempted to rename from '" + originalName
                + "' to '" + renameDestination + "'\nYou may have to manually rename " +
                "or re-create the data set! Error encountered while renaming: \n" + inspect(e));
        }
    });

    it("should give a syntax error if the data set names are omitted", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command_rename_data_set.sh", testEnvironment, []);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Positional");
        expect(stderr).toContain("data");
        expect(stderr).toContain("set");
        expect(stderr).toContain("Syntax");
        expect(result.status).toEqual(1);
    });
});
