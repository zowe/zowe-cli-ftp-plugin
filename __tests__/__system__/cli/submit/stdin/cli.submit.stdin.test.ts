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
import { IO } from "@zowe/imperative";

let user: string;
let connection: any;
let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;

describe("submit job from stdin command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_ftp_submit_stdin",
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
        const shellScript = path.join(__dirname, "__scripts__", "submit_stdin_help.sh");
        const response = runCliScript(shellScript, testEnvironment);

        expect(response.stderr.toString()).toBe("");
        expect(response.status).toBe(0);
        expect(response.stdout.toString()).toMatchSnapshot();
    });

    it("should be able to submit a job from standard in and see the job name and job id", async () => {

        const iefbr14DataSet = testEnvironment.systemTestProperties.jobs.iefbr14Member;
        const iefbr14Content = (await connection.getDataset(iefbr14DataSet)).toString();
        const jclFilePath = testEnvironment.workingDir + "/iefbr14.txt";
        await IO.writeFileAsync(jclFilePath, iefbr14Content);
        const result = runCliScript(__dirname + "/__scripts__/command/command_submit_stdin.sh", testEnvironment, [jclFilePath]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.stdout.toString()).toContain("jobid");
        expect(result.stdout.toString()).toContain("jobname");
    });

    it("should be able to submit a job from stdin with wait option and get rc successfully", async () => {

        const sleepDataSet = testEnvironment.systemTestProperties.jobs.sleepMember;
        const sleepContent = (await connection.getDataset(sleepDataSet)).toString();
        const jclFilePath = testEnvironment.workingDir + "/sleep.txt";
        await IO.writeFileAsync(jclFilePath, sleepContent);
        const option ="--wait";
        const wait = "3,10";
        const result = runCliScript(__dirname + "/__scripts__/command/command_submit_stdin_wait.sh", testEnvironment, [jclFilePath,option,wait]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.output.toString()).toContain("Waiting for job completion.");
        expect(result.output.toString()).toContain("rc:");
        expect(result.output.toString()).toContain("retcode:");
        expect(result.output.toString()).toContain("finished");
    });

    it("should give a syntax error if the wait value is invalid", async () => {

        const sleepDataSet = testEnvironment.systemTestProperties.jobs.sleepMember;
        const sleepContent = (await connection.getDataset(sleepDataSet)).toString();
        const jclFilePath = testEnvironment.workingDir + "/sleep.txt";
        await IO.writeFileAsync(jclFilePath, sleepContent);
        const option ="--wait";
        const wait = "3,";
        const result = runCliScript(__dirname + "/__scripts__/command/command_submit_stdin_wait.sh", testEnvironment, [jclFilePath,option,wait]);
        expect(result.output.toString()).toContain("comma-separated numeric values");
        expect(result.output.toString()).toContain("Syntax error:");
        expect(result.status).toEqual(0);
    });

    it("should be able to submit a job from stdin but not finished within specified wait option", async () => {

        // download the appropriate JCL content from the data set
        const sleepDataSet = testEnvironment.systemTestProperties.jobs.sleepMember;
        const sleepContent = (await connection.getDataset(sleepDataSet)).toString();
        const jclFilePath = testEnvironment.workingDir + "/sleep.txt";
        await IO.writeFileAsync(jclFilePath, sleepContent);
        const option ="--wait";
        const wait = "1,2";
        const result = runCliScript(__dirname + "/__scripts__/command/command_submit_stdin_wait.sh", testEnvironment, [jclFilePath,option,wait]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.output.toString()).toContain("Submitted job successfully");
        expect(result.output.toString()).toContain("Job is still running.");
        expect(result.output.toString()).toContain("Please using the following command to check its status later:");
    });

    it("should be able to submit a job from stdin with wait-for-output option and get rc successfully", async () => {

        const sleepDataSet = testEnvironment.systemTestProperties.jobs.sleepMember;
        const sleepContent = (await connection.getDataset(sleepDataSet)).toString();
        const jclFilePath = testEnvironment.workingDir + "/sleep.txt";
        await IO.writeFileAsync(jclFilePath, sleepContent);
        const option = "--wait-for-output";
        const result = runCliScript(__dirname + "/__scripts__/command/command_submit_stdin_wait.sh", testEnvironment, [jclFilePath,option]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.output.toString()).toContain("Waiting for job completion.");
        expect(result.output.toString()).toContain("rc:");
        expect(result.output.toString()).toContain("finished");
    });

    it("should be able to submit a job from stdin with wait-for-active option and get rc successfully", async () => {

        const sleepDataSet = testEnvironment.systemTestProperties.jobs.sleepMember;
        const sleepContent = (await connection.getDataset(sleepDataSet)).toString();
        const jclFilePath = testEnvironment.workingDir + "/sleep.txt";
        await IO.writeFileAsync(jclFilePath, sleepContent);
        const option = "--wait-for-active";
        const result = runCliScript(__dirname + "/__scripts__/command/command_submit_stdin_wait.sh", testEnvironment, [jclFilePath,option]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.output.toString()).not.toContain("rc:");
        expect(result.output.toString()).toContain("ACTIVE");
    });
});
