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

import DownloadUSSFileHandler from "../../../../../src/cli/download/uss-file/UssFile.Handler";
import TestUtils from "../../TestUtils";

describe("Download uss file handler", () => {

    it("should throw error if no uss file is found.", async () => {
        const handler = new DownloadUSSFileHandler();
        const files: any[] = [];
        const mockParams: any = {
            arguments: {
                ussFile: "ussFile1"
            },
            connection: {
                listDataset: jest.fn().mockReturnValue(Promise.resolve(files)),
                getUssFile: jest.fn().mockReturnValue(Promise.resolve(""))
            }
        };
        try {
            await handler.processFTP(mockParams);
            throw "Error is not thrown as expected.";
        } catch(err) {
            expect(err.message).toMatch("The file \"ussFile1\" doesn't exist");
        }
    });

    it("should return file contents if at least one file is found.", async () => {
        const handler = new DownloadUSSFileHandler();
        const files: any[] = [{
            name: "ussFile1",
            size: 100
        }];

        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                ussFile: "ussFile1"
            },
            connection: {
                listDataset: jest.fn().mockReturnValue(Promise.resolve(files)),
                getDataset: jest.fn().mockReturnValue(Promise.resolve(TestUtils.getSingleLineStream()))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.console.log.mock.calls[0][0].toString()).toBe("Successfully downloaded USS file '%s' to local file '%s'");
        expect(mockResponse.console.log.mock.calls[0][1].toString()).toBe("ussFile1");
        expect(mockResponse.console.log.mock.calls[0][2].toString()).toBe("ussFile1");
    });
});
