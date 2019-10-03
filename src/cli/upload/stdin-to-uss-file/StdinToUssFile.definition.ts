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

import { ICommandDefinition } from "@brightside/imperative";

export const UploadStdinToUssFileDefinition: ICommandDefinition = {
    handler: __dirname + "/StdinToUssFile.Handler",
    description: "Upload from stdin to a Unix System Services File",
    type: "command",
    name: "stdin-to-uss-file", aliases: ["stuf"],
    summary: "Upload stdin to a USS File",
    examples: [
        {
            description: "Upload to \"/u/users/ibmuser/iefbr14.txt\" from standard input (you can pipe into this command)",
            options: "\"/u/users/ibmuser/iefbr14.txt\""
        }
    ],
    positionals: [{
        name: "ussFile",
        description: "The USS file to which you would like to " +
        "upload content.",
        type: "string",
        required: true
    }],
    options: [
        {
            name: "binary", aliases: ["b"],
            description: "Upload content in binary mode.",
            type: "boolean"
        }
    ],
    profile:
        {optional: ["zftp"]},
};
