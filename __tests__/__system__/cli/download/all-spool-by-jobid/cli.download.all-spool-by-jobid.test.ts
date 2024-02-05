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
import { IO } from "@zowe/imperative";
import { CoreUtils } from "../../../../../src/api/CoreUtils";
import { prepareTestJclDataSet } from "../../PrepareTestJclDatasets";

let connection: any;
let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;
let iefbr14DataSet: string;

describe("download all-spool-by-jobid command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_ftp_download_asbj",
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

    it("should be able to submit an IEFBR14 job and then download the jobid", async () => {
        // download the appropriate JCL content from the data set
        const iefbr14Content = (await connection.getDataset(iefbr14DataSet)).toString();
        const jobid = await connection.submitJCL(iefbr14Content.toString());
        const JOB_WAIT = 2000;
        await CoreUtils.sleep(JOB_WAIT);
        const result = runCliScript(__dirname + "/__scripts__/command_download_all_spool_by_jobid.sh", testEnvironment, [jobid]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.stdout.toString()).toContain("Success");
        const outputDir = testEnvironment.workingDir + "/output";
        expect(IO.existsSync(outputDir)).toEqual(true);
        expect(IO.existsSync(outputDir + "/" + jobid)).toEqual(true);
        expect(IO.existsSync(outputDir + "/" + jobid + "/JES2")).toEqual(true);
        expect(IO.existsSync(outputDir + "/" + jobid + "/JES2/JESJCL.txt")).toEqual(true);
        expect(IO.readFileSync(outputDir + "/" + jobid + "/JES2/JESJCL.txt").toString()).toContain("IEFBR14");
    });

    it("should be able to submit a job from a local file and then download the spool, omitting the jobid directory", async () => {
        // download the appropriate JCL content from the data set
        const iefbr14Content = (await connection.getDataset(iefbr14DataSet)).toString();
        const jobid = await connection.submitJCL(iefbr14Content.toString());
        const JOB_WAIT = 2000;
        await CoreUtils.sleep(JOB_WAIT);
        const result = runCliScript(__dirname + "/__scripts__/command_download_all_spool_by_jobid_ojd.sh", testEnvironment, [jobid]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.stdout.toString()).toContain("Success");
        const outputDir = testEnvironment.workingDir + "/output";
        expect(IO.existsSync(outputDir)).toEqual(true);
        expect(IO.existsSync(outputDir)).toEqual(true);
        expect(IO.existsSync(outputDir + "/JES2")).toEqual(true);
        expect(IO.existsSync(outputDir + "/JES2/JESJCL.txt")).toEqual(true);
        expect(IO.readFileSync(outputDir + "/JES2/JESJCL.txt").toString()).toContain("IEFBR14");
    });

    it("should give a syntax error if the local file to submit is omitted", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command_download_all_spool_by_jobid.sh", testEnvironment, []);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Positional");
        expect(stderr).toContain("jobid");
        expect(stderr).toContain("Syntax");
        expect(result.status).toEqual(1);
    });
});
