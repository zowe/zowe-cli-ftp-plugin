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
import { ZosAccessor } from "zos-node-accessor";

let connection: ZosAccessor;
let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;

describe("list job ftp command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_list_job",
            installPlugin: true
        });
        expect(testEnvironment).toBeDefined();
        connection = await FTPConfig.connectFromArguments(testEnvironment.systemTestProperties.zftp);
    });

    afterAll(async () => {
        connection.close();
        await TestEnvironment.cleanUp(testEnvironment);
    });

    it("should be able to list the jobs with prefix and owner from the test properties file", async () => {
        const pre = "\"*\"";
        const owner ="\"*\"";
        const status = "\"*\"";
        const result = runCliScript(__dirname + "/__scripts__/command_list_job.sh", testEnvironment, [pre, owner, status]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        //expect(result.stdout.toString()).toContain("IBM");
    });

    it("should be able to list all jobs under the owner if not specified the prefix option", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command_list_job_noprefix.sh", testEnvironment);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
    });

    it("should be able to list the jobs with status from the test properties file", async () => {
        const pre = "\"*\"";
        const owner ="\"*\"";
        const status = "ACTIVE";
        const result = runCliScript(__dirname + "/__scripts__/command_list_job.sh", testEnvironment, [pre, owner, status]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(result.stdout.toString()).toContain("ACTIVE");
        expect(result.stdout.toString()).not.toContain("OUTPUT");
        //expect(result.stdout.toString()).toContain("IBM");
    });

    it("should give a syntax error if the job pattern is omitted", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command_list_job.sh", testEnvironment, []);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Syntax Error");
        expect(stderr).toContain("No value specified for option");
        expect(stderr).toContain("prefix");
        expect(result.status).toEqual(1);
    });
});
