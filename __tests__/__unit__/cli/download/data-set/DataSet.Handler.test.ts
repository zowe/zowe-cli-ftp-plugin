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

import { ZosFilesMessages } from "@zowe/cli";
import DownloadDataSetHandler from "../../../../../src/cli/download/data-set/DataSet.Handler";
import TestUtils from "../../TestUtils";
import { ImperativeError } from "@zowe/imperative";
import { Utilities } from "../../../../../src/cli/Utilities";

describe("Download data set handler", () => {

    it ("should throw ImperativeError for invalid file name", async () => {
        const handler = new DownloadDataSetHandler();
        const files: any[] = [
            {
                Used: 100
            }
        ];

        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                dataSet: "ds1",
                file: "invalid.txt☻"
            },
            connection: {
                listDataset: jest.fn().mockReturnValue(Promise.resolve(files)),
                getDataset: jest.fn().mockReturnValue(Promise.resolve(TestUtils.getSingleLineStream()))
            },
            response: mockResponse
        };

        jest.spyOn(Utilities, "isValidFileName").mockReturnValueOnce(false);

        try {
            await handler.processFTP(mockParams);
        } catch(err) {
            expect(err instanceof ImperativeError).toEqual(true);
            expect(err.message).toContain(ZosFilesMessages.invalidFileName.message);
        }
    });

    it("should throw error if no data set is found.", async () => {
        const handler = new DownloadDataSetHandler();
        const files: any[] = [];
        const mockParams: any = {
            arguments: {
                dataSet: "ds1"
            },
            connection: {
                listDataset: jest.fn().mockReturnValue(Promise.resolve(files))
            }
        };
        try {
            await handler.processFTP(mockParams);
            throw "Error is not thrown as expected.";
        } catch(err) {
            expect(err.message).toMatch("The dataset \"ds1\" doesn't exist");
        }
    });

    it("should return correct message if the data set is downloaded.", async () => {
        const handler = new DownloadDataSetHandler();
        const files: any[] = [
            {
                Used: 100
            }
        ];

        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                dataSet: "ds1",
                binary: true,
                rdw: true,
            },
            connection: {
                listDataset: jest.fn().mockReturnValue(Promise.resolve(files)),
                getDataset: jest.fn().mockReturnValue(Promise.resolve(TestUtils.getSingleLineStream()))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.console.log.mock.calls[0][0]).toBe(ZosFilesMessages.datasetDownloadedSuccessfully.message);
        expect(mockResponse.console.log.mock.calls[0][1]).toBe("ds1");
        expect(mockParams.connection.getDataset.mock.calls[0][1]).toBe("binary_rdw");
    });
});
