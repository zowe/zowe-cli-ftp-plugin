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

import ViewAllSpoolByJobIdHandler from "../../../../src/cli/view/all-spool-by-jobid/AllSpoolByJobId.Handler";
import TestUtils from "../../TestUtils";

describe("View all spool by job id handler", () => {

    it("should throw error if no job spool file is found.", async () => {
        const handler = new ViewAllSpoolByJobIdHandler();
        const spoolFiles: any[] = [];
        const jobDetails = {
            spoolFiles
        };
        const mockParams: any = {
            arguments: {
                jobid: "jobID1"
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

    it("should return data set contents if at least one data set is found.", async () => {
        const handler = new ViewAllSpoolByJobIdHandler();

        const spoolFiles: any[] = [
            {
                id: "fileId1"
            },
            {
                id: "fileId2"
            }
        ];
        const jobDetails = {
            spoolFiles
        };
        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                jobid: "jobID1"
            },
            connection: {
                getJobStatus: jest.fn().mockReturnValue(Promise.resolve(jobDetails)),
                getJobLog: jest.fn().mockReturnValueOnce(Promise.resolve("job file 1 contents"))
                    .mockReturnValueOnce(Promise.resolve("job file 2 contents"))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        const fullSpoolFiles = mockResponse.data.setObj.mock.calls[0][0];
        expect(fullSpoolFiles.length).toBe(2);
        expect(fullSpoolFiles[0].id).toBe("fileId1");
        expect(fullSpoolFiles[0].contents).toBe("job file 1 contents");
        expect(fullSpoolFiles[1].id).toBe("fileId2");
        expect(fullSpoolFiles[1].contents).toBe("job file 2 contents");
    });
});
