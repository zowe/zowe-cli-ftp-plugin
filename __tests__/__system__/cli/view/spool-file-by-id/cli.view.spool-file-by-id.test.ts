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

import { ITestEnvironment } from "../../../../__src__/environment/doc/response/ITestEnvironment";
import { FTPConfig } from "../../../../../src/api/FTPConfig";
import { TestEnvironment } from "../../../../__src__/environment/TestEnvironment";
import { runCliScript } from "../../../../__src__/TestUtils";
import * as path from "path";
import { CoreUtils } from "../../../../../src/api/CoreUtils";
import { IO } from "@brightside/imperative";

let dsname: string;
let user: string;
let connection: any;

let testEnvironment: ITestEnvironment;
describe("view spool-file-by-id command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_ftp_view_spool_file_by_id",
            installPlugin: true
        });
        expect(testEnvironment).toBeDefined();
        connection = await FTPConfig.connectFromArguments(testEnvironment.systemTestProperties.zosftp);
        user = testEnvironment.systemTestProperties.zosftp.user.trim().toUpperCase();

    });

    afterAll(async () => {
        connection.close();
        await TestEnvironment.cleanUp(testEnvironment);
    });

    it("should display view spool-file-by-id help", () => {
        const shellScript = path.join(__dirname, "__scripts__", "view_spool_file_by_id_help.sh");
        const response = runCliScript(shellScript, testEnvironment);

        expect(response.stderr.toString()).toBe("");
        expect(response.status).toBe(0);
        expect(response.stdout.toString()).toMatchSnapshot();
    });

    it("should be able to submit a job and then view the JESJCL DD by ID", async () => {

        const fileToUpload = __dirname + "/resources/IEFBR14.JCL";
        const destination = testEnvironment.systemTestProperties.datasets.writablePDS.toUpperCase() + "(IEFBR14)";
        const result1 = runCliScript(__dirname + "/__scripts__/command/command_upload_file_to_data_set.sh", testEnvironment,
            [fileToUpload, destination]);

        expect(result1.stderr.toString()).toEqual("");
        expect(result1.status).toEqual(0);
        const uploadedContent = (await connection.getDataset(destination)).toString();
        const expectedContent = IO.readFileSync(fileToUpload).toString();
        const uploadedLines = uploadedContent.split(/\r?\n/g);
        const expectedLines = expectedContent.split(/\r?\n/g);
        for (let x = 0; x < expectedLines.length; x++) {
            expect(uploadedLines[x].trim()).toEqual(expectedLines[x].trim());
        }
        // download the appropriate JCL content from the data set
        const iefbr14DataSet = destination;
        const iefbr14Content = (await connection.getDataset(iefbr14DataSet)).toString();
        const jobID = await connection.submitJCL(iefbr14Content);

        const ONE_SECOND = 1000;
        await CoreUtils.sleep(ONE_SECOND);
        const jobStatus = await connection.getJobStatus(jobID);
        let jesJCLID: string;
        for (const file  of jobStatus.spoolFiles) {
            if (file.ddname === "JESJCL") {
                jesJCLID = file.id;
                break;
            }
        }
        expect(jesJCLID).toBeDefined();
        const result = runCliScript(__dirname + "/__scripts__/command/command_view_spool_file_by_id.sh", testEnvironment, [jobID, jesJCLID]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        const stdout = result.stdout.toString();
        expect(result.stdout.toString()).toContain("IEFBR14");
        for (const word of iefbr14Content.split(/[ \s]/g)) {
            // the original JCL should pretty much be present from the JESJCL spool DD
            // but it's modified slightly like expanded procedures etc. so we can't just put "toContain"
            expect(stdout).toContain(word);
        }
        expect(result.stdout.toString()).toContain(jobID);
    });

    it("should give a syntax error if the jobid and spool ID are omitted", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command/command_view_spool_file_by_id.sh", testEnvironment, []);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Positional");
        expect(stderr).toContain("spool");
        expect(stderr).toContain("jobid");
        expect(stderr).toContain("Syntax");
        expect(result.status).toEqual(1);
    });
});
