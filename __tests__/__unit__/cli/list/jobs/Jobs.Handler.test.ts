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

import { Job } from "zos-node-accessor/lib/interfaces/Job";
import ListJobsHandler from "../../../../../src/cli/list/jobs/Jobs.Handler";
import TestUtils from "../../TestUtils";

describe("List jobs handler", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
    });

    it("should return no job if the job is not found.", async () => {
        const handler = new ListJobsHandler();
        const jobs: any[] = [];

        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                prefix: "job*"
            },
            connection: {
                listJobs: jest.fn().mockReturnValue(Promise.resolve(jobs))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.data.setMessage.mock.calls[0][0]).toBe("Successfully listed %d matching jobs");
        expect(mockResponse.data.setMessage.mock.calls[0][1]).toBe(0);
    });

    it("should return correct message if the job is found.", async () => {
        const handler = new ListJobsHandler();
        const jobs: Job[] = [
            { jobName: "JOBNAME1", jobId: "JOBID1", owner: "OWNER1", status: "STATUS1", class: "CLASS1" },
            { jobName: "JOBNAME2", jobId: "JOBID2", owner: "OWNER2", status: "STATUS2", class: "CLASS2" },
        ];

        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                prefix: "job*",
                owner: "*",
                status: "*"
            },
            connection: {
                listJobs: jest.fn().mockReturnValue(Promise.resolve(jobs))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.data.setMessage.mock.calls[0][0]).toBe("Successfully listed %d matching jobs");
        expect(mockResponse.data.setMessage.mock.calls[0][1]).toBe(2);
        expect(mockResponse.data.setObj.mock.calls[0][0][0].owner).toContain("OWNER1");
        expect(mockResponse.data.setObj.mock.calls[0][0][1].owner).toContain("OWNER2");
        expect(mockResponse.data.setObj.mock.calls[0][0][0].status).toContain("STATUS1");
        expect(mockResponse.data.setObj.mock.calls[0][0][1].status).toContain("STATUS2");
        const obj = Object.keys(mockResponse.data.setObj.mock.calls[0][0]);
        expect(obj.length).toBe(2);
    });

});
