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

import DeleteDataSetHandler from "../../../../../src/cli/delete/data-set/DataSet.Handler";
import TestUtils from "../../TestUtils";

describe("Delete data set handler", () => {

    it("should return correct message if the data set is deleted.", async () => {
        const handler = new DeleteDataSetHandler();

        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                dataSet: "ds1"
            },
            connection: {
                deleteDataset: jest.fn().mockReturnValue(Promise.resolve(""))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.console.log.mock.calls[0][0]).toBe("Successfully deleted data set file %s");
        expect(mockResponse.console.log.mock.calls[0][1]).toBe("ds1");
    });
});
