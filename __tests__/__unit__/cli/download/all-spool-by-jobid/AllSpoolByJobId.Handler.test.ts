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

import ViewAllSpoolByJobIdHandler from "../../../../../src/cli/download/all-spool-by-jobid/AllSpoolByJobId.Handler";
import TestUtils from "../../TestUtils";

import { DownloadJobs } from "@zowe/cli";
import { IO } from "@zowe/imperative";

describe("Download all spool by job id handler", () => {

    it("should throw error if no job is found.", async () => {
        const handler = new ViewAllSpoolByJobIdHandler();
        const spoolFiles: any[] = [];
        const jobDetails = {
            spoolFiles
        };
        const mockParams: any = {
            arguments: {
                jobid: "jobid1"
            },
            connection: {
                getJobStatus: jest.fn().mockReturnValue(Promise.resolve(jobDetails))
            }
        };
        try {
            await handler.processFTP(mockParams);
            throw "Error is not thrown as expected.";
        } catch(err) {
            expect(err.message).toContain("No spool files were available");
        }
    });

    it("should write spool file to file system if the job is deleted.", async () => {
        const handler = new ViewAllSpoolByJobIdHandler();
        const spoolFiles: any[] = [
            {
                id: 1
            }
        ];
        const jobDetails = {
            jobid: "jobid1",
            jobname: "job1",
            spoolFiles
        };

        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                jobid: "jobid1"
            },
            connection: {
                getJobStatus: jest.fn().mockReturnValue(Promise.resolve(jobDetails)),
                getJobLog: jest.fn().mockReturnValue(Promise.resolve("spool file 1"))
            },
            response: mockResponse
        };
        const mockGetSpoolDownloadFile = jest.fn().mockReturnValue("value");
        const mockCreateDirsSyncFromFilePath = jest.fn();
        const mockWriteFile = jest.fn();

        // eslint-disable-next-line deprecation/deprecation
        DownloadJobs.getSpoolDownloadFile = mockGetSpoolDownloadFile;
        IO.createDirsSyncFromFilePath = mockCreateDirsSyncFromFilePath;
        IO.writeFile = mockWriteFile;
        IO.isSubPath = jest.fn().mockReturnValue(true);

        await handler.processFTP(mockParams);
        expect(mockCreateDirsSyncFromFilePath).toBeCalled();
        expect(mockWriteFile).toBeCalled();
        expect(mockResponse.console.log.mock.calls[0][0]).toBe("Successfully downloaded %d spool files to %s");
        expect(mockResponse.console.log.mock.calls[0][1]).toBe(1);
        expect(mockResponse.console.log.mock.calls[0][2]).toBe("./output/");
    });

    it.each([
        ["ddname with backtrack",           { id: "1", ddname: "../../.bashrc" }],
        ["ddname with absolute path",        { id: "1", ddname: "/etc/passwd" }],
        ["stepname with backtrack",          { id: "1", ddname: "SYSOUT", stepname: "../.." }],
        ["procstep with backtrack",          { id: "1", ddname: "SYSOUT", procstep: "../../evil" }],
        ["stepname with embedded separator", { id: "1", ddname: "SYSOUT", stepname: "a/b" }],
    ])("should throw for unsafe path traversal: %s", async (_label, spoolFileData) => {
        const handler = new ViewAllSpoolByJobIdHandler();
        const jobDetails = {
            jobid: "JOB00001", jobname: "TESTJOB",
            spoolFiles: [spoolFileData],
        };
        const mockParams: any = {
            arguments: { jobid: "JOB00001" },
            connection: {
                getJobStatus: jest.fn().mockResolvedValue(jobDetails),
                getJobLog: jest.fn().mockResolvedValue("contents"),
            },
            response: TestUtils.getMockResponse(),
        };
        await expect(handler.processFTP(mockParams)).rejects.toThrow("unsafe path segment");
    });
});
