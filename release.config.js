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

module.exports = {
    branches: [
        {
            name: "master",
            level: "minor",
            devDependencies: ["@zowe/cli", "@zowe/imperative", "@zowe/cli-test-utils"]
        },
        {
            name: "zowe-v1-lts",
            level: "patch",
            devDependencies: ["@zowe/cli", "@zowe/imperative"]
        },
        {
            name: "next",
            prerelease: true,
            level: "next",
            devDependencies: ["@zowe/cli", "@zowe/imperative", "@zowe/cli-test-utils"]
        }
    ],
    plugins: [
        "@octorelease/changelog",
        ["@octorelease/npm", {
            aliasTags: {
                latest: ["zowe-v2-lts"]
            },
            pruneShrinkwrap: true
        }],
        ["@octorelease/github", {
            checkPrLabels: true
        }],
        "@octorelease/git"
    ]
};
