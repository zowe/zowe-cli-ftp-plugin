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


export const DeleteUssFileDefinition: ICommandDefinition = {
    handler: __dirname + "/UssFile.Handler",
    description: "Delete a USS file",
    type: "command",
    name: "uss-file", aliases: ["uss"],
    summary: "Delete a USS file",
    examples: [
        {
            description: "Delete the USS file \"/u/ibmuser/myfile.txt\"",
            options: "\"/u/ibmuser/myfile.txt\" -f"
        }
    ],
    positionals: [
        {
            name: "ussFile",
            description: "The absolute path to a USS file you would like to delete.",
            type: "string",
            required: true
        }
    ],
    options: [
        {
            name: "for-sure",
            aliases: ["f"],
            description: "Specify this option to confirm that you want to delete the data set permanently.",
            type: "boolean",
            required: true
        }
    ],
    profile:
        {required: ["zftp"]},
};
