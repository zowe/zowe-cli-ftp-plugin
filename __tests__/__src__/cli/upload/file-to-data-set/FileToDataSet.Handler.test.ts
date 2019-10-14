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

import { IO } from "@brightside/imperative";
import { CoreUtils } from "../../../../../src/api/CoreUtils";
import UploadFileToDataSetHandler from "../../../../../src/cli/upload/file-to-data-set/FileToDataSet.Handler";
import TestUtils from "../../TestUtils";

describe("Upload file to data set handler", () => {

    it("should return correct message if the file is uploaded successfully.", async () => {
        const handler = new UploadFileToDataSetHandler();

        IO.readFileSync = jest.fn().mockReturnValue(Promise.resolve(Buffer.from("sss")));
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
        expect(mockResponse.console.log.mock.calls[0][1]).toBe("local file '/u/user/file1'");
        expect(mockResponse.console.log.mock.calls[0][2]).toBe("ds1");
    });

});
