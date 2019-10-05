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

import { UssUtils } from "../../../src/api/UssUtils";

describe("UssUtils", () => {

    it("should return the normalized path as is", () => {
        let path = UssUtils.normalizeUnixPath("C:\Users\hello.text");
        expect(path).toBe("C:\Users\hello.text");

        path = UssUtils.normalizeUnixPath("/home/user1/hello.text");
        expect(path).toBe("/home/user1/hello.text");
    });

    it("should normanlize path correctly", () => {
        let path = UssUtils.normalizeUnixPath("C:/Users/hello.text");
        expect(path).toBe("/c/Users/hello.text");

        path = UssUtils.normalizeUnixPath("//home/user1/hello.text");
        expect(path).toBe("/home/user1/hello.text");
    });
});
