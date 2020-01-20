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


export const UploadStdinToDataSetDefinition: ICommandDefinition = {
    handler: __dirname + "/StdinToDataSet.Handler",
    description: "Upload contents piped to stdin to a z/OS data set",
    type: "command",
    name: "stdin-to-data-set", aliases: ["stds"],
    summary: "Upload from stdin to a data set",
    examples: [
        {
            description: "Upload to \"ibmuser.cntl(iefbr14)\" from standard input (you can pipe into this command)",
            options: "\"ibmuser.cntl(iefbr14)\""
        }
    ],
    positionals: [
        {
            name: "dataSet",
            description: "The data set (PDS member or physical sequential data set) to which you would like to " +
            "upload content.",
            type: "string",
            required: true
        }
    ],
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
