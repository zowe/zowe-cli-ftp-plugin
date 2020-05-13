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

import { ICommandDefinition } from "@zowe/imperative";


export const MakeUssDirectoryDefinition: ICommandDefinition = {
    handler: __dirname + "/UssDirectory.Handler",
    description: "Make a Unix System Services Directory",
    type: "command",
    name: "uss-directory", aliases: ["dir"],
    summary: "Make a USS directory",
    examples: [
        {
            description: "Make a USS directory \"/u/users/ibmuser/mydir\"",
            options: "\"/u/users/ibmuser/mydir\""
        }
    ],
    positionals: [{
        name: "ussDirectory",
        description: "The USS directory you'd like to make.",
        type: "string",
        required: true
    }],
    profile:
        {optional: ["zftp"]}
};
