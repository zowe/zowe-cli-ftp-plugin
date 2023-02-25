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

import { ImperativeError } from "@zowe/imperative";
import { FTPConfig } from "../../src/api/FTPConfig";
import { FTPBaseHandler } from "../../src/FTPBase.Handler";
import { IFTPHandlerParams } from "../../src/IFTPHandlerParams";

describe("FTP Base Handler", () => {
    const spyProcessFTP = jest.fn();
    const handler = new class extends FTPBaseHandler {
        public async processFTP(additionalParameters: IFTPHandlerParams): Promise<void> {
            spyProcessFTP(additionalParameters);
        }
    };

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should call the processFTP abstract method", async () => {
        const connection = {close: jest.fn()};
        const parms: any = {};
        jest.spyOn(FTPConfig, "connectFromArguments").mockResolvedValue(connection);

        await handler.process(parms);

        expect(parms.connection).toEqual(connection);
        expect(spyProcessFTP).toHaveBeenCalledWith(parms);
        expect(connection.close).toHaveBeenCalled();
    });

    const processErrors = async (errorMessage: string, expectedError: string): Promise<boolean> => {
        jest.spyOn(FTPConfig, "connectFromArguments").mockRejectedValue({message: errorMessage});

        let caughtError;
        try {
            await handler.process({} as any);
        } catch (err) {
            caughtError = err;
        }

        expect(caughtError).toBeInstanceOf(ImperativeError);
        expect(caughtError.message).toContain(expectedError);
        return true;
    };
    it("should handle errors when an unknown error happens when establishing a connection", async () => {
        const ret = await processErrors("test error", "test error");
        expect(ret).toBe(true);
    });

    it("should handle errors when credentials prevent us from creating a connection", async () => {
        const ret = await processErrors("PASS command failed", "Username or password are not valid or expired.");
        expect(ret).toBe(true);
    });

    it("should handle errors when using the MKD command", async () => {
        const ret = await processErrors("requests a nonexistent partitioned data set.  Use MKD command to create it", "Use allocate command");
        expect(ret).toBe(true);
    });
});
