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

import ViewDataSetHandler from "../../../../../src/cli/view/data-set/DataSet.Handler";
import TestUtils from "../../TestUtils";

describe("View data set handler", () => {

    it("should throw error if no data set is found.", async () => {
        const handler = new ViewDataSetHandler();
        const files: any[] = [];
        const mockParams: any = {
            arguments: {
                dataSet: "ds1"
            },
            connection: {
                listDataset: jest.fn().mockReturnValue(Promise.resolve(files)),
                getDataset: jest.fn().mockReturnValue(Promise.resolve(""))
            }
        };
        try {
            await handler.processFTP(mockParams);
            throw "Error is not thrown as expected.";
        } catch(err) {
            expect(err.message).toMatch("The dataset \"ds1\" doesn't exist");
        }
    });

    it("should return data set contents if at least one data set is found.", async () => {
        const handler = new ViewDataSetHandler();
        const files: any[] = [{
            Used: 100
        }];

        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                dataSet: "ds1"
            },
            connection: {
                listDataset: jest.fn().mockReturnValue(Promise.resolve(files)),
                getDataset: jest.fn().mockReturnValue(Promise.resolve(TestUtils.getSingleLineStream()))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.data.setObj.mock.calls[0][0].toString()).toBe("Hello world");
        expect(mockResponse.console.log.mock.calls[0][0].toString()).toBe("Hello world");
    });
});
