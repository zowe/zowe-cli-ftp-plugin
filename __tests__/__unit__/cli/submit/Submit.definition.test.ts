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

import * as SubmitDefinition from "../../../../src/cli/submit/Submit.definition";

describe("Submit definition", () => {

    it("should match the snapshot", () => {
        SubmitDefinition.children.forEach((child) => {
            child.handler = child.handler.replace(/^.*[\\/]/, "");
        });
        expect(SubmitDefinition).toMatchSnapshot();
    });

});
