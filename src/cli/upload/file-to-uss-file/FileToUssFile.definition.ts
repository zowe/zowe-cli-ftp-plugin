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

export const UploadFileToUssFileDefinition: ICommandDefinition = {
    handler: __dirname + "/FileToUssFile.Handler",
    description: "Upload contents of a local to a Unix System Services file.",
    type: "command",
    name: "file-to-uss-file", aliases: ["ftuf"],
    summary: "Upload a local file to a USS File",
    examples: [
        {
            description: "Upload to \"/u/users/ibmuser/iefbr14.txt\" from the file iefbr14.txt",
            options: "iefbr14.txt \"/u/users/ibmuser/iefbr14.txt\""
        }
    ],
    positionals: [{
        name: "file",
        description: "Upload the contents of this local file to a data set.",
        type: "existingLocalFile",
        required: true,
    }, {
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
