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

import RenameUssFileHandler from "../../../../../src/cli/rename/uss-file/UssFile.Handler";
import TestUtils from "../../TestUtils";

describe("Rename uss files handler", () => {

    it("should return correct message if the uss file is renamed correctly.", async () => {
        const handler = new RenameUssFileHandler();
        const files: any[] = [];

        const mockResponse = TestUtils.getMockResponse();
        const mockParams: any = {
            arguments: {
                olduss: "oldname",
                newuss: "newname"
            },
            connection: {
                rename: jest.fn().mockReturnValue(Promise.resolve(files))
            },
            response: mockResponse
        };
        await handler.processFTP(mockParams);
        expect(mockResponse.console.log.mock.calls[0][0]).toBe("Successfully renamed USS file or directory from '%s' to '%s'");
        expect(mockResponse.console.log.mock.calls[0][1]).toBe("oldname");
        expect(mockResponse.console.log.mock.calls[0][2]).toBe("newname");
    });

});
