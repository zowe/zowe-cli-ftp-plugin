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

import * as ListDefinition from "../../../src/cli/list/List.definition";

describe("List definition", () => {

    it("should match the snapshot", () => {
        ListDefinition.children.forEach((child) => {
            child.handler = child.handler.replace(/^.*[\\/]/, "");

            // Remove console color control characters from snapshot.
            if (child.positionals && child.positionals.length > 0) {
                const description = child.positionals[0].description;
                // eslint-disable-next-line no-control-regex
                child.positionals[0].description = description.replace(/\x1b\[33m/g, "").replace(/\x1b\[39m/g, "");
            }
        });
        expect(ListDefinition).toMatchSnapshot();
    });

});
