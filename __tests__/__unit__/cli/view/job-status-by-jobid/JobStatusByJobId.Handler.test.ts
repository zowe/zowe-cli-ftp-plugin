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

import ViewJobStatusByJobIdHandler from "../../../../../src/cli/view/job-status-by-jobid/JobStatusByJobId.Handler";
import TestUtils from "../../TestUtils";

describe("View job status by jobid handler", () => {

    it("should return correct job status if the job is found.", async () => {
        const handler = new ViewJobStatusByJobIdHandler();

        const jobDetails = {
            jobName: "jobName1",
            jobId: "jobId1",
            owner: "owner1",
            status: "success",
            rc: 0
        };

        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                jobId: "jobID1"
            },
            connection: {
                getJobStatus: jest.fn().mockReturnValue(Promise.resolve(jobDetails))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.data.setObj.mock.calls[0][0]).toMatchSnapshot();
        expect(mockResponse.format.output.mock.calls[0][0]).toMatchSnapshot();
    });
});
