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

import listDatasetHandler from "../../../../../src/cli/list/uss-files/UssFiles.Handler";
import TestUtils from "../../TestUtils";

describe("List uss files handler", () => {

    it("should return no uss file if the uss file is not found.", async () => {
        const handler = new listDatasetHandler();
        const files: any[] = [];

        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                directory: "/u/user"
            },
            connection: {
                listDataset: jest.fn().mockReturnValue(Promise.resolve(files))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.data.setMessage.mock.calls[0][0]).toBe("Listed files in uss directory %s");
        expect(mockResponse.data.setMessage.mock.calls[0][1]).toBe("/u/user");
        expect(mockResponse.data.setObj.mock.calls[0][0]).toMatchSnapshot();
        expect(mockResponse.format.output.mock.calls[0][0]).toMatchSnapshot();
    });

    it("should return correct message if the uss file is found.", async () => {
        const handler = new listDatasetHandler();
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
                directory: "/u/user"
            },
            connection: {
                listDataset: jest.fn().mockReturnValue(Promise.resolve(files))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.data.setMessage.mock.calls[0][0]).toBe("Listed files in uss directory %s");
        expect(mockResponse.data.setMessage.mock.calls[0][1]).toBe("/u/user");
        expect(mockResponse.data.setObj.mock.calls[0][0]).toMatchSnapshot();
        expect(mockResponse.format.output.mock.calls[0][0]).toMatchSnapshot();
    });

    it("should return correct files if the file name pattern is specified.", async () => {
        const handler = new listDatasetHandler();
        const files: any[] = [
            { name: "ds1" },
            { name: "ds2" },
            { name: "dt1" },
            { name: "dt2" }
        ];

        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                directory: "/u/user/ds*"
            },
            connection: {
                listDataset: jest.fn().mockReturnValue(Promise.resolve(files))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.data.setMessage.mock.calls[0][0]).toBe("Listed files in uss directory %s");
        expect(mockResponse.data.setMessage.mock.calls[0][1]).toBe("/u/user/ds*");
        expect(mockResponse.data.setObj.mock.calls[0][0]).toMatchSnapshot();
        expect(mockResponse.format.output.mock.calls[0][0]).toMatchSnapshot();

        mockParams.arguments.directory = "/u/user/*1";
        await handler.processFTP(mockParams);
        expect(mockResponse.data.setMessage.mock.calls[1][0]).toBe("Listed files in uss directory %s");
        expect(mockResponse.data.setMessage.mock.calls[1][1]).toBe("/u/user/*1");
        expect(mockResponse.data.setObj.mock.calls[1][0]).toMatchSnapshot();
        expect(mockResponse.format.output.mock.calls[1][0]).toMatchSnapshot();

        mockParams.arguments.directory = "/u/user/d*2";
        await handler.processFTP(mockParams);
        expect(mockResponse.data.setMessage.mock.calls[2][0]).toBe("Listed files in uss directory %s");
        expect(mockResponse.data.setMessage.mock.calls[2][1]).toBe("/u/user/d*2");
        expect(mockResponse.data.setObj.mock.calls[2][0]).toMatchSnapshot();
        expect(mockResponse.format.output.mock.calls[2][0]).toMatchSnapshot();

        mockParams.arguments.directory = "/u/user/*";
        await handler.processFTP(mockParams);
        expect(mockResponse.data.setMessage.mock.calls[3][0]).toBe("Listed files in uss directory %s");
        expect(mockResponse.data.setMessage.mock.calls[3][1]).toBe("/u/user/*");
        expect(mockResponse.data.setObj.mock.calls[3][0]).toMatchSnapshot();
        expect(mockResponse.format.output.mock.calls[3][0]).toMatchSnapshot();
    });
});
