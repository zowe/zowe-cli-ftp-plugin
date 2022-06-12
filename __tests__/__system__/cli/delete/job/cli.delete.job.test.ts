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
import * as path from "path";
import { CoreUtils } from "../../../../../src/api/CoreUtils";

let dsname: string;
let user: string;
let connection: any;
let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;

describe("delete job command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_ftp_delete_job",
            installPlugin: true
        });
        expect(testEnvironment).toBeDefined();
        connection = await FTPConfig.connectFromArguments(testEnvironment.systemTestProperties.zftp);
        user = testEnvironment.systemTestProperties.zftp.user.trim().toUpperCase();

    });

    afterAll(async () => {
        connection.close();
        await TestEnvironment.cleanUp(testEnvironment);
    });

    it("should display submit job from local file help", () => {
        const shellScript = path.join(__dirname, "__scripts__", "delete_job_help.sh");
        const response = runCliScript(shellScript, testEnvironment);

        expect(response.stderr.toString()).toBe("");
        expect(response.status).toBe(0);
        expect(response.stdout.toString()).toMatchSnapshot();
    });

    it("should be able to submit a job from a local file and then delete the job", async () => {

        // download the appropriate JCL content from the data set
        const iefbr14DataSet = testEnvironment.systemTestProperties.jobs.iefbr14Member;
        const iefbr14Content = (await connection.getDataset(iefbr14DataSet)).toString();
        const jobID = await connection.submitJCL(iefbr14Content);
        const ONE_SECOND = 1000;
        await CoreUtils.sleep(ONE_SECOND);
        const result = runCliScript(__dirname + "/__scripts__/command/command_delete_job.sh", testEnvironment, [jobID]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.stdout.toString()).toContain("deleted");
    });

    it("should give a syntax error if the job ID to delete is omitted", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command/command_delete_job.sh", testEnvironment, []);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Positional");
        expect(stderr).toContain("jobid");
        expect(stderr).toContain("Syntax");
        expect(result.status).toEqual(1);
    });
});
