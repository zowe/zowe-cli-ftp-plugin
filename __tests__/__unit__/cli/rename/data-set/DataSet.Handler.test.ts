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

import RenameDataSetHandler from "../../../../../src/cli/rename/data-set/DataSet.Handler";
import TestUtils from "../../TestUtils";

describe("Rename data set handler", () => {

    it("should return correct message if the data set is renamed correctly.", async () => {
        const handler = new RenameDataSetHandler();
        const files: any[] = [];

        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                oldDataSet: "oldname",
                newDataSet: "newname"
            },
            connection: {
                renameDataset: jest.fn().mockReturnValue(Promise.resolve(files))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.console.log.mock.calls[0][0]).toBe("Successfully renamed data set from '%s' to '%s'");
        expect(mockResponse.console.log.mock.calls[0][1]).toBe("oldname");
        expect(mockResponse.console.log.mock.calls[0][2]).toBe("newname");
    });

});
