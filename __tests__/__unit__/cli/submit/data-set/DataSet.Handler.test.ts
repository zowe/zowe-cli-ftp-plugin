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

import { Readable } from "stream";
import SubmitJobFromLocalFileHandler from "../../../../../src/cli/submit/data-set/DataSet.Handler";
import TestUtils from "../../TestUtils";

describe("Submit data set handler", () => {

    it("should return correct message if the data set is submit successfully.", async () => {
        const handler = new SubmitJobFromLocalFileHandler();
        const jobDetails = {
            jobname: "jobname1",
            jobid: "jobid1"
        };

        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                dataSet: "ds1"
            },
            connection: {
                getDataset: jest.fn().mockReturnValue(Promise.resolve(getStream())),
                submitJCL: jest.fn().mockReturnValue(Promise.resolve("jobid1")),
                getJobStatus: jest.fn().mockReturnValue(Promise.resolve(jobDetails)),
                listDataset: jest.fn().mockReturnValue(Promise.resolve([''])),
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.data.setObj.mock.calls[0][0]).toMatchSnapshot();
        expect(mockResponse.format.output.mock.calls[0][0]).toMatchSnapshot();
    });

    it("should return correct message if the data set is submit successfully with wait option.", async () => {

        const handler = new SubmitJobFromLocalFileHandler();
        const jobDetails = {
            jobid: "jobid2",
            jobname: "jobname2",
            owner: "owner2",
            status: "OUTPUT",
            rc: 0,
            retcode: "CC 0000",
        };

        const jobRuning = {
            jobid: "jobid2",
            jobname: "jobname2",
            owner: "owner2",
            status: "ACTIVE"
        };

        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                dataSet: "ds2",
                wait: "5,10"
            },
            connection: {
                getDataset: jest.fn().mockReturnValue(Promise.resolve(getStream())),
                submitJCL: jest.fn().mockReturnValue(Promise.resolve("jobid2")),
                getJobStatus: jest.fn().mockReturnValueOnce(Promise.resolve(jobRuning)).mockReturnValueOnce(Promise.resolve(jobRuning))
                    .mockReturnValue(Promise.resolve(jobDetails)),
                listDataset: jest.fn().mockReturnValue(Promise.resolve([''])),
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.data.setObj.mock.calls[0][0]).toMatchSnapshot();
        expect(mockResponse.format.output.mock.calls[0][0]).toMatchSnapshot();
        expect(mockParams.connection.getJobStatus).toHaveBeenCalledTimes(3);
        expect(mockResponse.console.log.mock.calls[1][0]).toBe("Waiting for job completion.");
    });

    function getStream(): Readable {
        const stream = new Readable();
        stream.push(Buffer.from(""));
        stream.push(null);
        return stream;
    }
});
