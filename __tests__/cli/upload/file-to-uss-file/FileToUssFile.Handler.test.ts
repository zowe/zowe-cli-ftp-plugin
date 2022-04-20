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

import { IO } from "@zowe/imperative";
import { CoreUtils } from "../../../../src/api/CoreUtils";
import UploadFileToUssFileHandler from "../../../../src/cli/upload/file-to-uss-file/FileToUssFile.Handler";
import TestUtils from "../../TestUtils";

describe("Upload file to data set handler", () => {

    it("should return no data set if the data set is not found.", async () => {
        const handler = new UploadFileToUssFileHandler();

        IO.readFileSync = jest.fn().mockReturnValue(Promise.resolve(Buffer.from("sss")));
        // UssUtils.normalizeUnixPath =
        CoreUtils.addCarriageReturns = jest.fn().mockReturnValue(("sss"));
        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                file: "/u/user/file1",
                ussFile: "/u/user/ussfile1"
            },
            connection: {
                uploadDataset: jest.fn().mockReturnValue(Promise.resolve(""))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.console.log.mock.calls[0][0]).toBe("Uploaded from %s to %s ");
        expect(mockResponse.console.log.mock.calls[0][1]).toBe("local file '/u/user/file1'");
        expect(mockResponse.console.log.mock.calls[0][2]).toBe("/u/user/ussfile1");
    });

});
