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

import SpoolFileByIdHandler from "../../../../src/cli/view/spool-file-by-id/SpoolFileById.Handler";
import TestUtils from "../../TestUtils";

describe("View spool file by id handler", () => {

    it("should return correct spool file contents if the spool file is found.", async () => {
        const handler = new SpoolFileByIdHandler();

        const mockResponse = TestUtils.getMockResponse();
        const jobDetails = {
            jobname: "jobname1",
            jobid: "jobid1",
            owner: "owner1",
            status: "success",
            rc: 0
        };
        const mockParams: any = {
            arguments: {
                jobid: "jobid1",
                spoolfileid: "123"
            },
            connection: {
                getJobLog: jest.fn().mockReturnValue(Promise.resolve("spool file contents")),
                getJobStatus: jest.fn().mockReturnValue(Promise.resolve(jobDetails))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.data.setObj.mock.calls[0][0]).toBe("spool file contents");
        expect(mockResponse.data.setMessage.mock.calls[0][0]).toBe("Spool file \"123\" content obtained for job ID \"jobid1)\"");
    });
});
