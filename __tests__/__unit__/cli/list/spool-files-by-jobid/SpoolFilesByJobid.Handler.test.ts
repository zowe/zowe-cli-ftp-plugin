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

import ListSpoolFilesByJobidHandler from "../../../../../src/cli/list/spool-files-by-jobid/SpoolFilesByJobid.Handler";
import TestUtils from "../../TestUtils";

describe("List spool files by job id handler", () => {

    // eslint-disable-next-line jest/no-focused-tests
    it("should return no spool file if the no spool file is not found.", async () => {
        const handler = new ListSpoolFilesByJobidHandler();
        const files: any[] = [];
        const jobDetails = {
            jobName: "jobName1",
            jobId: "jobId1",
            spoolFiles: files
        };

        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                jobId: "jobId1"
            },
            connection: {
                getJobStatus: jest.fn().mockReturnValue(Promise.resolve(jobDetails))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.console.log.mock.calls[0]).toContain("No spool file.");
    });

    it("should return correct message if at least one spool file is found.", async () => {
        const handler = new ListSpoolFilesByJobidHandler();
        const jobDetails = {
            jobName: "jobName1",
            jobId: "jobId1",
            spoolFiles: [
                {
                    name: "file1"
                },
                {
                    name: "file2"
                }
            ]
        };

        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                jobId: "jobId1"
            },
            connection: {
                getJobStatus: jest.fn().mockReturnValue(Promise.resolve(jobDetails))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.data.setMessage.mock.calls[0][0]).toBe("\"2\" spool files obtained for job \"jobName1(jobId1)\"");
        expect(mockResponse.format.output.mock.calls[0][0]).toMatchSnapshot();
        expect(mockResponse.data.setObj.mock.calls[0][0]).toMatchSnapshot();
        expect(mockResponse.format.output.mock.calls[0][0]).toMatchSnapshot();
    });

});
