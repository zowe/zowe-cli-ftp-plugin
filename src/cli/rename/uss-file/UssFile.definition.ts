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


export const RenameUssFileDefinition: ICommandDefinition = {
    handler: __dirname + "/UssFile.Handler",
    description: "Rename a USS file or directory",
    type: "command",
    name: "uss-file", aliases: ["uss"],
    summary: "Rename a USS file or directory",
    examples: [
        {
            description: "Rename the file /u/users/ibmuser/hello.txt to /u/users/ibmuser/hello2.txt",
            options: "\"/u/users/ibmuser/hello.txt)\" \"/u/users/ibmuser/hello2.txt\""
        }
    ],
    positionals: [
        {
            name: "olduss",
            description: "The current name of the USS file you want to rename.",
            type: "string",
            required: true
        },
        {
            name: "newuss",
            description: "The new name for the USS file.",
            type: "string",
            required: true
        }
    ],
    profile:
        {required: ["zftp"]},
};
