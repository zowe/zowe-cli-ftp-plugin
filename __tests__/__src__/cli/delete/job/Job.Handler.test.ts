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

import DeleteJobHandler from "../../../../../src/cli/delete/job/Job.Handler";
import TestUtils from "../../TestUtils";

describe("Delete job handler", () => {

    it("should return correct message if the job is deleted.", async () => {
        const handler = new DeleteJobHandler();

        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                jobid: "jobid1"
            },
            connection: {
                deleteJob: jest.fn().mockReturnValue(Promise.resolve(""))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.console.log.mock.calls[0][0]).toBe("Successfully deleted job %s");
        expect(mockResponse.console.log.mock.calls[0][1]).toBe("jobid1");
    });
});
