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
import { prepareTestJclDataSet } from "../../PrepareTestJclDatasets";
import { ZosAccessor } from "zos-node-accessor";

let connection: ZosAccessor;
let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;
let iefbr14DataSet: string;
let sleepDataSet: string;
let iefbr14Content: string;
let sleepContent: string;

describe("submit job from local file command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_ftp_submit_jflf",
            installPlugin: true
        });
        expect(testEnvironment).toBeDefined();
        connection = await FTPConfig.connectFromArguments(testEnvironment.systemTestProperties.zftp);

        const pds = testEnvironment.systemTestProperties.datasets.writablePDS;
        iefbr14DataSet = await prepareTestJclDataSet(connection, pds, "IEFBR14");
        sleepDataSet = await prepareTestJclDataSet(connection, pds, "SLEEP");
        iefbr14Content = (await connection.downloadDataset(iefbr14DataSet)).toString();
        sleepContent = (await connection.downloadDataset(sleepDataSet)).toString();
    });

    afterAll(async () => {
        connection?.close();
        await TestEnvironment.cleanUp(testEnvironment);
    });

    it("should be able to submit a job from a local file and see the job name and job id", async () => {
        const jclFilePath = testEnvironment.workingDir + "/iefbr14.txt";
        await IO.writeFileAsync(jclFilePath, iefbr14Content);
        const result = runCliScript(__dirname + "/__scripts__/command_submit_local_file.sh", testEnvironment, [jclFilePath]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.stdout.toString()).toContain("jobid");
        expect(result.stdout.toString()).toContain("jobname");
    });

    it("should be able to submit a job from a local file with wait option and get rc successfully", async () => {
        const jclFilePath = testEnvironment.workingDir + "/sleep.txt";
        await IO.writeFileAsync(jclFilePath, sleepContent);
        const option = "--wait";
        const wait = "3,10";
        const result = runCliScript(__dirname + "/__scripts__/command_submit_local_file_wait.sh", testEnvironment, [jclFilePath,option,wait]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.output.toString()).toContain("Waiting for job completion.");
        expect(result.output.toString()).toContain("rc:");
        expect(result.output.toString()).toContain("retcode:");
        expect(result.output.toString()).toContain("finished");
    });

    it("should give a syntax error if the wait value is invalid", async () => {
        const jclFilePath = testEnvironment.workingDir + "/sleep.txt";
        await IO.writeFileAsync(jclFilePath, sleepContent);
        const option = "--wait";
        const wait = "3,";
        const result = runCliScript(__dirname + "/__scripts__/command_submit_local_file_wait.sh", testEnvironment, [jclFilePath,option,wait]);
        expect(result.output.toString()).toContain("comma-separated numeric values");
        expect(result.output.toString()).toContain("Syntax error:");
        expect(result.status).toEqual(0);
    });

    it("should be able to submit a job from a local file but not finished within specified wait option", async () => {
        const jclFilePath = testEnvironment.workingDir + "/sleep.txt";
        await IO.writeFileAsync(jclFilePath, sleepContent);
        const option ="--wait";
        const wait = "1,2";
        const result = runCliScript(__dirname + "/__scripts__/command_submit_local_file_wait.sh", testEnvironment, [jclFilePath,option,wait]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.output.toString()).toContain("Submitted job successfully");
        expect(result.output.toString()).toContain("Job is still running.");
        expect(result.output.toString()).toContain("Please using the following command to check its status later:");
    });

    it("should be able to submit a job from a local file with wait-for-output option and get rc successfully", async () => {
        const jclFilePath = testEnvironment.workingDir + "/sleep.txt";
        await IO.writeFileAsync(jclFilePath, sleepContent);
        const option = "--wait-for-output";
        const result = runCliScript(__dirname + "/__scripts__/command_submit_local_file_wait.sh", testEnvironment, [jclFilePath,option]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.output.toString()).toContain("Waiting for job completion.");
        expect(result.output.toString()).toContain("rc:");
        expect(result.output.toString()).toContain("finished");
    });

    it("should be able to submit a job from a local file with wait-for-active option and get rc successfully", async () => {
        const jclFilePath = testEnvironment.workingDir + "/sleep.txt";
        await IO.writeFileAsync(jclFilePath, sleepContent);
        const option = "--wait-for-active";
        const result = runCliScript(__dirname + "/__scripts__/command_submit_local_file_wait.sh", testEnvironment, [jclFilePath,option]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.output.toString()).not.toContain("rc:");
        expect(result.output.toString()).toContain("ACTIVE");
    });

    it("should give a syntax error if the local file to submit is omitted", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command_submit_local_file.sh", testEnvironment, []);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Positional");
        expect(stderr).toContain("local");
        expect(stderr).toContain("file");
        expect(stderr).toContain("Syntax");
        expect(result.status).toEqual(1);
    });
});
