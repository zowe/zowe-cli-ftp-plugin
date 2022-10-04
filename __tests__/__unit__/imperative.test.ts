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

describe("imperative config", () => {

    // Will fail if impertive config object is changed. This is a sanity/protection check to ensure that any
    // changes to the configuration document are intended (and the snapshot must be updated).
    it("should match the snapshot", () => {
        const config = require("../../src/imperative");
        expect(config).toMatchSnapshot();
    });
});
