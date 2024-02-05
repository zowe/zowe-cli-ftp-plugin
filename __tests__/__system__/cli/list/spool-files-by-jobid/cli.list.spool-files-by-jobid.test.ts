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
import { CoreUtils } from "../../../../../src/api/CoreUtils";
import { prepareTestJclDataSet } from "../../PrepareTestJclDatasets";

let connection: any;
let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;
let iefbr14DataSet: string;

describe("list spool-files-by-jobid command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_ftp_list_sfbj",
            installPlugin: true
        });
        expect(testEnvironment).toBeDefined();
        connection = await FTPConfig.connectFromArguments(testEnvironment.systemTestProperties.zftp);

        const pds = testEnvironment.systemTestProperties.datasets.writablePDS;
        iefbr14DataSet = await prepareTestJclDataSet(connection, pds, "IEFBR14");
    });

    afterAll(async () => {
        connection?.close();
        await TestEnvironment.cleanUp(testEnvironment);
    });

    it("should be able to submit a job and then list spool files for the job ID", async () => {
        // download the appropriate JCL content from the data set
        const iefbr14Content = (await connection.getDataset(iefbr14DataSet)).toString();
        expect(iefbr14Content).toContain("IEFBR14");
        const jobid = await connection.submitJCL(iefbr14Content);
        const ONE_SECOND = 1000;
        await CoreUtils.sleep(ONE_SECOND);
        const result = runCliScript(__dirname + "/__scripts__/command_list_spool_files_by_jobid.sh", testEnvironment, [jobid]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.stdout.toString()).toContain("JESJCL");
        expect(result.stdout.toString()).toContain("JESMSGLG");
    });

    it("should give a syntax error if the job ID is omitted", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command_list_spool_files_by_jobid.sh", testEnvironment, []);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Positional");
        expect(stderr).toContain("jobid");
        expect(stderr).toContain("Syntax");
        expect(result.status).toEqual(1);
    });
});
