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

import { CoreUtils } from "../../../../src/api/CoreUtils";
import SubmitJobFromLocalFileHandler from "../../../../src/cli/submit/stdin/Stdin.Handler";
import TestUtils from "../../TestUtils";

describe("Submit job from stdin handler", () => {

    it("should return correct message if the job is submit successfully.", async () => {
        const handler = new SubmitJobFromLocalFileHandler();
        const jobDetails = {
            jobname: "jobname1",
            jobid: "jobid1",
            spoolFiles: [
                {
                    name: "file1"
                },
                {
                    name: "file2"
                }
            ]
        };

        CoreUtils.readStdin = jest.fn().mockReturnValue(Promise.resolve(Buffer.from("sss")));
        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                file: "/u/user/jcl"
            },
            connection: {
                submitJCL: jest.fn().mockReturnValue(Promise.resolve("jobid1")),
                getJobStatus: jest.fn().mockReturnValue(Promise.resolve(jobDetails))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.data.setObj.mock.calls[0]).toMatchSnapshot();
        expect(mockResponse.format.output.mock.calls[0]).toMatchSnapshot();
    });

    it("should return correct message if the job is submit successfully with wait option.", async () => {
        const handler = new SubmitJobFromLocalFileHandler();
        const jobDetails = {
            jobid: "jobid2",
            jobname: "jobname2",
            owner: "owner2",
            status: "OUTPUT",
            rc: 0,
            retcode: 'CC 0000',
            spoolFiles: [
                {
                    name: "file1"
                },
                {
                    name: "file2"
                }
            ]
        };


        const jobRuning = {
            jobid: "jobid2",
            jobname: "jobname2",
            owner: "owner2",
            status: "ACTIVE"
        };

        CoreUtils.readStdin = jest.fn().mockReturnValue(Promise.resolve(Buffer.from("sss")));
        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                file: "/u/user/jcl",
                wait: "5,10"
            },
            connection: {
                submitJCL: jest.fn().mockReturnValue(Promise.resolve("jobid2")),
                getJobStatus: jest.fn().mockReturnValueOnce(Promise.resolve(jobRuning)).mockReturnValueOnce(Promise.resolve(jobRuning))
                    .mockReturnValue(Promise.resolve(jobDetails))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.data.setObj.mock.calls[0]).toMatchSnapshot();
        expect(mockResponse.format.output.mock.calls[0]).toMatchSnapshot();
        expect(mockParams.connection.getJobStatus).toHaveBeenCalledTimes(3);
        expect(mockResponse.console.log.mock.calls[1][0]).toBe("Waiting for job completion.");
    });
});
