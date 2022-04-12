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

export const DownloadDataSetDefinition: ICommandDefinition = {
    handler: __dirname + "/DataSet.Handler",
    description: "Download the contents of a z/OS data set to a local file",
    type: "command",
    name: "data-set", aliases: ["ds"],
    summary: "Download data set content to a local file",
    examples: [
        {
            description: "Download the data set \"ibmuser.loadlib(main)\" in binary mode to the local file \"main.obj\"",
            options: "\"ibmuser.loadlib(main)\" -b -f main.obj"
        }
    ],
    positionals: [{
        name: "dataSet",
        description: "The data set (PDS member or physical sequential data set) which you would like to download to a local file.",
        type: "string",
        required: true
    }],
    options: [
        {
            name: "binary",
            aliases: ["b"],
            description: "Download the file content in binary mode, which means that no data conversion is performed. The data " +
                "transfer process returns each line as-is, without translation. No delimiters are added between records.",
            type: "boolean"
        },
        {
            name: "file",
            aliases: ["f"],
            description: "The path to the local file where you want to download the content. When you omit the option, " +
                "the command generates a file name automatically for you.",
            type: "string"
        },
        {
            name: "record",
            aliases: ["rdw"],
            description: "Download the variable-length data set with RECFM of V, VB, VBS, etc in rdw mode, in which " +
                "the 4-byte RDW (Record Descriptor Word) is inserted at the begining of each record.",
            type: "boolean"
        }
    ],
    profile:
        {optional: ["zftp"]},
};
