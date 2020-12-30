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

import AllocateDataSetHandler from "../../../../../src/cli/allocate/data-set/DataSet.Handler";
import TestUtils from "../../TestUtils";

describe("Allocate data set handler", () => {

    it("should return correct message if the dataset is allocated successfully.", async () => {
        const handler = new AllocateDataSetHandler();
        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                datasetName: "dsname",
                options: {dcb: ""}
            },
            connection: {
                allocateDataset: jest.fn().mockReturnValue(Promise.resolve(""))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.console.log.mock.calls[0][0]).toBe("Allocate dataset %s successfully!");
        expect(mockResponse.console.log.mock.calls[0][1]).toBe("dsname");
        //expect(mockResponse.console.log.mock.calls[0][2]).toBe("newname");
    });

});
