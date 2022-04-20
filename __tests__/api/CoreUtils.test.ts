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

import { CoreUtils } from "../../src/api/CoreUtils";

describe("CoreUtils", () => {

    it("should return the correct non-secure config", () => {
        let s = CoreUtils.addCarriageReturns("hello\r\nworld");
        expect(s).toBe("hello\r\nworld");

        s = CoreUtils.addCarriageReturns("hello\nworld");
        expect(s).toBe("hello\r\nworld");

        s = CoreUtils.addCarriageReturns("hello world");
        expect(s).toBe("hello world");
    });

});
