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

import ListDataSetHandler from "../../../../src/cli/list/data-set/DataSet.Handler";
import TestUtils from "../../TestUtils";

describe("List data set handler", () => {

    it("should return no data set if the data set is not found.", async () => {
        const handler = new ListDataSetHandler();
        const files: any[] = [];

        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                pattern: "ds*"
            },
            connection: {
                listDataset: jest.fn().mockReturnValue(Promise.resolve(files))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.data.setMessage.mock.calls[0][0]).toBe("Successfully listed %d matching data sets for pattern '%s'");
        expect(mockResponse.data.setMessage.mock.calls[0][1]).toBe(0);
        expect(mockResponse.data.setMessage.mock.calls[0][2]).toBe("ds*");
        expect(mockResponse.data.setObj.mock.calls[0][0]).toMatchSnapshot();
        expect(mockResponse.format.output.mock.calls[0][0]).toMatchSnapshot();
    });

    it("should return correct message if the data set is found.", async () => {
        const handler = new ListDataSetHandler();
        const files: any[] = [
            {
                name: "ds1"
            },
            {
                name: "ds2"
            }
        ];

        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                pattern: "ds*"
            },
            connection: {
                listDataset: jest.fn().mockReturnValue(Promise.resolve(files))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.data.setMessage.mock.calls[0][0]).toBe("Successfully listed %d matching data sets for pattern '%s'");
        expect(mockResponse.data.setMessage.mock.calls[0][1]).toBe(2);
        expect(mockResponse.data.setMessage.mock.calls[0][2]).toBe("ds*");
        expect(mockResponse.data.setObj.mock.calls[0][0]).toMatchSnapshot();
        expect(mockResponse.format.output.mock.calls[0][0]).toMatchSnapshot();
    });

});
