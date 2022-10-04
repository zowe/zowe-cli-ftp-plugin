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

let connection: any;
let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;

describe("view spool-file-by-id command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_ftp_view_spool_file_by_id",
            installPlugin: true
        });
        expect(testEnvironment).toBeDefined();
        connection = await FTPConfig.connectFromArguments(testEnvironment.systemTestProperties.zftp);
    });

    afterAll(async () => {
        connection.close();
        await TestEnvironment.cleanUp(testEnvironment);
    });

    it("should be able to submit a job and then view the JESJCL DD by ID", async () => {
        // download the appropriate JCL content from the data set
        const iefbr14DataSet = testEnvironment.systemTestProperties.jobs.iefbr14Member;
        let iefbr14Content = (await connection.getDataset(iefbr14DataSet)).toString();
        const jobID = await connection.submitJCL(iefbr14Content);
        const FIVE_SECOND = 5000;
        await CoreUtils.sleep(FIVE_SECOND);
        const jobStatus = await connection.getJobStatus(jobID);
        let jesJCLID: string;
        for (const file  of jobStatus.spoolFiles) {
            if (file.ddname === "JESJCL") {
                jesJCLID = file.id;
                break;
            }
        }
        expect(jesJCLID).toBeDefined();
        const result = runCliScript(__dirname + "/__scripts__/command_view_spool_file_by_id.sh", testEnvironment, [jobID, jesJCLID]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        const stdout = result.stdout.toString();
        expect(result.stdout.toString()).toContain("IEFBR14");
        iefbr14Content = iefbr14Content.split("\n").map((line: string) => {
            // Exclude the potential trailing statement number.
            const JCL_LINE_LENGTH = 72;
            return line.substring(0, JCL_LINE_LENGTH);
        }).join("\n");
        for (const word of iefbr14Content.split(/[ \s]/g)) {
            // the original JCL should pretty much be present from the JESJCL spool DD
            // but it's modified slightly like expanded procedures etc. so we can't just put "toContain"
            expect(stdout).toContain(word);
        }
        expect(result.stdout.toString()).toContain(jobID);
    });

    it("should give a syntax error if the jobid and spool ID are omitted", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command_view_spool_file_by_id.sh", testEnvironment, []);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Positional");
        expect(stderr).toContain("spool");
        expect(stderr).toContain("jobid");
        expect(stderr).toContain("Syntax");
        expect(result.status).toEqual(1);
    });
});
