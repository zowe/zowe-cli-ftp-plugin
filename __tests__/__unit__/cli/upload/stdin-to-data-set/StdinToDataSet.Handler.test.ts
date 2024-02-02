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

import { CoreUtils } from "../../../../../src/api/CoreUtils";
import UploadStdinToDataSetHandler from "../../../../../src/cli/upload/stdin-to-data-set/StdinToDataSet.Handler";
import TestUtils from "../../TestUtils";

describe("Upload stdin to data set handler", () => {

    it("should return no data set if the data set is not found.", async () => {
        const handler = new UploadStdinToDataSetHandler();

        CoreUtils.readStdin = jest.fn().mockReturnValue(Promise.resolve(Buffer.from("sss")));
        CoreUtils.addCarriageReturns = jest.fn().mockReturnValue(("sss"));
        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                file: "/u/user/file1",
                dataSet: "ds1"
            },
            connection: {
                uploadDataset: jest.fn().mockReturnValue(Promise.resolve(""))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.console.log.mock.calls[0][0]).toBe("Uploaded from %s to %s ");
        expect(mockResponse.console.log.mock.calls[0][1]).toBe("stdin");
        expect(mockResponse.console.log.mock.calls[0][2]).toBe("DS1");
    });

    it("should upload contents with Buffer.", async () => {
        // This case is added to verify https://github.com/zowe/vscode-extension-for-zowe/issues/2533
        // FTP client checks whether the string to put is a local file path first.
        // If yes, it puts the whole file; otherwise, it puts the string as the contents.
        // On windows, error is thrown when FTP client uses fs.stat() with the file path starting with "//".

        const handler = new UploadStdinToDataSetHandler();

        CoreUtils.readStdin = jest.fn().mockReturnValue(Promise.resolve(Buffer.from("sss")));
        CoreUtils.addCarriageReturns = jest.fn().mockReturnValue(("sss"));
        const mockResponse = TestUtils.getMockResponse();
        const mockUploadDataset = jest.fn();
        const mockParams: any = {
            arguments: {
                dataSet: "ds1"
            },
            connection: {
                uploadDataset: mockUploadDataset
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        // The contents to upload must be Buffer. FTP client tries to fs.stat() first,
        // if the contents is string.
        expect(mockUploadDataset.mock.calls[0][0] instanceof Buffer).toBeTruthy();
    });

});
