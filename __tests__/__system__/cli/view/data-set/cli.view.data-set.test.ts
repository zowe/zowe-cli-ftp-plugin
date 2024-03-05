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
import { generateRandomAlphaNumericString, generateRandomBytes } from "../../../../__src__/TestUtils";
import { prepareTestJclDataSet } from "../../PrepareTestJclDatasets";
import { ZosAccessor } from "zos-node-accessor";
import { ITransferMode } from "../../../../../src/api";

let connection: ZosAccessor;
let testDataSet: string;
let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;
let iefbr14DataSet: string;

describe("view data-set command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_view_dataset",
            installPlugin: true
        });
        expect(testEnvironment).toBeDefined();
        connection = await FTPConfig.connectFromArguments(testEnvironment.systemTestProperties.zftp);
        testDataSet = testEnvironment.systemTestProperties.datasets.writablePDS;

        const pds = testEnvironment.systemTestProperties.datasets.writablePDS;
        iefbr14DataSet = await prepareTestJclDataSet(connection, pds, "IEFBR14");
    });

    afterAll(async () => {
        connection?.close();
        await TestEnvironment.cleanUp(testEnvironment);
    });

    it("should be able to view the job data set from the test properties file", async () => {
        const iefbr14Content = (await connection.downloadDataset(iefbr14DataSet)).toString();
        const result = runCliScript(__dirname + "/__scripts__/command_view_data_set.sh", testEnvironment, [iefbr14DataSet]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.stdout.toString().trim()).toContain("IEFBR14");
        expect(result.stdout.toString().trim()).toContain(iefbr14Content.trim());
    });

    it("should be able to upload to a data set in binary mode, then view the content with the CLI and " +
        "verify that the content is correct", async () => {
        const randomContentLength = 60;
        const randomContent = await generateRandomBytes(randomContentLength);
        const memberSuffixLength = 6;
        const destination = testDataSet + "(R" + generateRandomAlphaNumericString(memberSuffixLength) + ")";
        await connection.uploadDataset(randomContent, "'" + destination + "'", ITransferMode.BINARY);
        const result = runCliScript(__dirname + "/__scripts__/command_view_data_set_binary.sh", testEnvironment,
            [destination]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        const uploadedContent = (await connection.downloadDataset("'" + destination + "'", ITransferMode.BINARY));
        // binary upload to a fixed record  data set will fill a data set with zeroes for the remainder of the record
        // so we can trim the zeroes off and still be accurate
        const uploadedContentString = uploadedContent.toString("hex").replace(/0+$/g, "");
        expect(uploadedContentString).toEqual(randomContent.toString("hex").replace(/0+$/g, ""));
        await connection.deleteDataset(destination);
    });

    it("should give a syntax error if the data set is omitted", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command_view_data_set.sh", testEnvironment, []);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Positional");
        expect(stderr).toContain("data set");
        expect(stderr).toContain("Syntax");
        expect(result.status).toEqual(1);
    });
});
