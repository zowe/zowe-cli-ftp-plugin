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

import { IO, Logger } from "@zowe/imperative";
import { AbstractTemplatedJCL } from "../../../src/api/AbstractTemplatedJCL";

describe("FTP Base Handler", () => {
    const testClass = new class extends AbstractTemplatedJCL {
        public DEFAULT_TEMPLATE = "TEST";
        public test() {
            this.log;
        }
    };

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should define a logger used by the CoreUtils.addCarriageReturns method", () => {
        const loggerSpy = jest.spyOn(Logger, "getAppLogger").mockImplementation();
        testClass.test();
        expect(loggerSpy).toHaveBeenCalled();
    });

    it("should call the processFTP abstract method", () => {
        const spyIO = jest.spyOn(IO, "readFileSync").mockReturnValue(Buffer.from("JCL"));
        const spyLoggerDebug = jest.fn();
        const loggerSpy = jest.spyOn(Logger, "getAppLogger").mockReturnValue({debug: spyLoggerDebug} as any);

        const response = testClass.getJcl("/test/path", "sub");

        expect(loggerSpy).toHaveBeenCalled();
        expect(spyIO).toHaveBeenCalledWith("/test/path");
        expect(response).toEqual("JCL\r\nTEST");
        expect(spyLoggerDebug).toHaveBeenCalled();
    });

    it("should call the processFTP abstract method with a custome template", () => {
        const spyIO = jest.spyOn(IO, "readFileSync");
        const spyLoggerDebug = jest.fn();
        const loggerSpy = jest.spyOn(Logger, "getAppLogger").mockReturnValue({debug: spyLoggerDebug} as any);
        spyIO.mockReturnValueOnce(Buffer.from("JCL"));
        spyIO.mockReturnValueOnce(Buffer.from("TEMPLATE"));

        const response = testClass.getJcl("/test/path", "sub", "/test/template");

        expect(loggerSpy).toHaveBeenCalled();
        expect(spyIO).toHaveBeenCalledWith("/test/path");
        expect(spyIO).toHaveBeenCalledWith("/test/template");
        expect(response).toEqual("JCL\r\nTEMPLATE");
        expect(spyLoggerDebug).toHaveBeenCalled();
    });
});
