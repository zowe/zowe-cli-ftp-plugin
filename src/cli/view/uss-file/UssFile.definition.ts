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


export const ViewUssFileDefinition: ICommandDefinition = {
    handler: __dirname + "/UssFile.Handler",
    description: "View the contents of a Unix System Services File",
    type: "command",
    name: "uss-file", aliases: ["uss"],
    summary: "View  USS file content",
    examples: [
        {
            description: "View the content of the USS file \"/u/users/ibmuser/myfile.txt\"",
            options: "\"/u/users/ibmuser/myfile.txt\""
        },
        {
            description: "View the content of the USS file \"/u/users/ibmuser/myjava.jar\" in" +
            " binary mode and pipe it into the hex viewer command xxd",
            options: "\"/u/users/ibmuser/myjava.jar\" -b | xxd "
        }
    ],
    positionals: [{
        name: "ussFile",
        description: "The USS file you'd like to view the contents of.",
        type: "string",
        required: true
    }],
    options: [{
        name: "binary", aliases: ["b"],
        description: "View content in binary form without converting to ASCII text",
        type: "boolean"
    }],
    profile:
        {required: ["zftp"]}
};
