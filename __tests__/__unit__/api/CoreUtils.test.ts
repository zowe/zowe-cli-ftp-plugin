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
import { CoreUtils } from "../../../src/api/CoreUtils";
import { PassThrough } from "stream";

describe("CoreUtils", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("readStdin", () => {
        it("should read from given stream", async () => {
            const stream = new PassThrough();

            process.nextTick(() => stream.emit("data", Buffer.from("test")));
            process.nextTick(() => stream.end());
            process.nextTick(() => stream.destroy());
            const response = await CoreUtils.readStdin(stream);

            expect(response.toString()).toEqual("test");
        });

        it("should handle error from stdin", async () => {
            const stream = new PassThrough();
            process.nextTick(() => stream.emit("error", Buffer.from("TEST_ERROR")));
            process.nextTick(() => stream.end());
            process.nextTick(() => stream.destroy());

            let caughtError: ImperativeError;
            try {
                await CoreUtils.readStdin(stream);
                throw "FAILURE";
            } catch(err) {
                caughtError = err;
            }

            expect((caughtError as any).msg).toEqual("Error encountered while reading from stdin");
            expect(caughtError.causeErrors.toString()).toEqual("TEST_ERROR");
        });
    });

    describe("sleep", () => {
        it("should sleep for 20 seconds", () => {
            jest.useFakeTimers();
            jest.spyOn(global, 'setTimeout');

            CoreUtils.sleep(20000);

            expect(setTimeout).toHaveBeenCalledTimes(1);
            expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 20000);
        });
    });

    describe("getProfileMeta", () => {
        it("should return profile metadata", async () => {
            const profiles = require("../../../src/imperative").profiles;
            const response = await CoreUtils.getProfileMeta();
            expect(response).toEqual(profiles);
        });
    });

    describe("addCarriageReturns", () => {
        it("should return the correct non-secure config", () => {
            let s = CoreUtils.addCarriageReturns("hello\r\nworld");
            expect(s).toBe("hello\r\nworld");

            s = CoreUtils.addCarriageReturns("hello\nworld");
            expect(s).toBe("hello\r\nworld");

            s = CoreUtils.addCarriageReturns("hello world");
            expect(s).toBe("hello world");
        });
    });
});
