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
import * as path from "path";
import { IO } from "@zowe/imperative";

let dsname: string;
let user: string;
let connection: any;
let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;

describe("submit job from local file command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            tempProfileTypes: ["zftp"],
            testName: "zos_ftp_download_ds",
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

    it("should display download data-set help", () => {
        const shellScript = path.join(__dirname, "__scripts__", "download_data_set_help.sh");
        const response = runCliScript(shellScript, testEnvironment);

        expect(response.stderr.toString()).toBe("");
        expect(response.status).toBe(0);
        expect(response.stdout.toString()).toMatchSnapshot();
    });

    it("should be able to download a data set to a  local file in text mode and verify the content", async () => {

        // download the appropriate JCL content from the data set
        const iefbr14DataSet = testEnvironment.systemTestProperties.jobs.iefbr14Member;
        const iefbr14Content = (await connection.getDataset(iefbr14DataSet)).toString();
        const downloadFilePath = testEnvironment.workingDir + "/iefbr14.txt";
        const result = runCliScript(__dirname + "/__scripts__/command/command_download_data_set.sh", testEnvironment,
            [iefbr14DataSet, downloadFilePath]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(IO.existsSync(downloadFilePath)).toBe(true);
        const downloadedContent = IO.readFileSync(downloadFilePath);
        expect(downloadedContent.toString()).toContain(iefbr14Content);
        IO.deleteFile(downloadFilePath);
    });

    it("should be able to download a data set to a  local file in binary mode and verify the content", async () => {
        // download the appropriate JCL content from the data set
        const testDataSet = testEnvironment.systemTestProperties.datasets.writablePDS;
        const randomContentLength = 60;
        const randomContent = await generateRandomBytes(randomContentLength);
        const memberSuffixLength = 6;
        const binaryMember = testDataSet + "(R" + generateRandomAlphaNumericString(memberSuffixLength) + ")";
        await connection.uploadDataset(randomContent, "'" + binaryMember + "'", "binary");
        const downloadFilePath = testEnvironment.workingDir + "/iefbr14.txt";
        const result = runCliScript(__dirname + "/__scripts__/command/command_download_data_set_binary.sh", testEnvironment,
            [binaryMember, downloadFilePath]);
        expect(result.stderr.toString()).toEqual("");
        expect(result.status).toEqual(0);
        expect(IO.existsSync(downloadFilePath)).toBe(true);
        // binary upload to a fixed record  data set will fill a data set with zeroes for the remainder of the record
        // so we can trim the zeroes off and still be accurate
        const uploadedContent = IO.readFileSync(downloadFilePath, undefined, true);
        const uploadedContentString = uploadedContent.toString("hex").replace(/0+$/g, "");
        expect(uploadedContentString).toEqual(randomContent.toString("hex"));
        await connection.deleteDataset(binaryMember);
    });

    it("should give a syntax error if the data set name is omitted", async () => {
        const result = runCliScript(__dirname + "/__scripts__/command/command_download_data_set.sh", testEnvironment,
            ["", testEnvironment.workingDir + "/myfile.txt"]);
        const stderr = result.stderr.toString();
        expect(stderr).toContain("Positional");
        expect(stderr).toContain("dataSet");
        expect(stderr).toContain("Syntax");
        expect(result.status).toEqual(1);
    });
});
