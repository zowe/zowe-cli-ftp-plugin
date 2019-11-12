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
import { generateRandomAlphaNumericString, generateRandomBytes, runCliScript } from "../../../../__src__/TestUtils";
import * as path from "path";
import { IO } from "@brightside/imperative";

let dsname: string;
let user: string;
let connection: any;
let testDataSet: string;
let testEnvironment: ITestEnvironment;
describe("view data-set command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_view_dataset",
            installPlugin: true
        });
        expect(testEnvironment).toBeDefined();
        connection = await FTPConfig.connectFromArguments(testEnvironment.systemTestProperties.zosftp);
        user = testEnvironment.systemTestProperties.zosftp.user.trim().toUpperCase();


        testDataSet = testEnvironment.systemTestProperties.datasets.writablePDS;
    });

    afterAll(async () => {
        connection.close();
        await TestEnvironment.cleanUp(testEnvironment);
    });

    it("should display view data set help", () => {
        const shellScript = path.join(__dirname, "__scripts__", "view_ds_help.sh");
        const response = runCliScript(shellScript, testEnvironment);

        expect(response.stderr.toString()).toBe("");
        expect(response.status).toBe(0);
        expect(response.stdout.toString()).toMatchSnapshot();
    });

    it("should be able to view the job data set from the test properties file", async () => {

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

        const iefbr14DataSet = destination;
        const iefbr14Content = (await connection.getDataset(iefbr14DataSet)).toString();
        const result = runCliScript(__dirname + "/__scripts__/command/command_view_data_set.sh", testEnvironment, [iefbr14DataSet]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);

        expect(result.stdout.toString().trim()).toContain("IEFBR14");
        expect(result.stdout.toString().trim()).toContain(iefbr14Content.trim());
    });

    it("should be able to upload to a data set in binary mode, then view the content with the CLI and verify that the content is correct",
        async () => {
            const randomContentLength = 60;
            const randomContent = await generateRandomBytes(randomContentLength);
            const memberSuffixLength = 6;
            const destination = testDataSet + "(R" + generateRandomAlphaNumericString(memberSuffixLength) + ")";
            await connection.uploadDataset(randomContent, "'" + destination + "'", "binary");
            const result = runCliScript(__dirname + "/__scripts__/command/command_view_data_set_binary.sh", testEnvironment,
                [destination]);
            expect(result.stderr.toString()).toEqual("");
            expect(result.status).toEqual(0);
            const uploadedContent = (await connection.getDataset("'" + destination + "'", "binary"));
            // binary upload to a fixed record  data set will fill a data set with zeroes for the remainder of the record
            // so we can trim the zeroes off and still be accurate
            const uploadedContentString = uploadedContent.toString("hex").replace(/0+$/g, "");
            expect(uploadedContentString).toEqual(randomContent.toString("hex").replace(/0+$/g, ""));
            await connection.deleteDataset(destination);
        });


    it("should give a syntax error if the data set is omitted", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command/command_view_data_set.sh", testEnvironment, []);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Positional");
        expect(stderr).toContain("data set");
        expect(stderr).toContain("Syntax");
        expect(result.status).toEqual(1);
    });
});
