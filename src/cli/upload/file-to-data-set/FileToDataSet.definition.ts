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


export const UploadFileToDataSetDefinition: ICommandDefinition = {
    handler: __dirname + "/FileToDataSet.Handler",
    description: "Upload contents of a local file to a z/OS data set",
    type: "command",
    name: "file-to-data-set", aliases: ["ftds"],
    summary: "Upload from local file to data set",
    examples: [
        {
            description: "Upload  \"ibmuser.cntl(iefbr14)\" from the file iefbr14.txt",
            options: "\"ibmuser.cntl(iefbr14)\" --file iefbr14.txt"
        }
    ],
    positionals: [
        {
            name: "file",
            description: "Upload the contents of this file to the data set",
            type: "existingLocalFile",
            required: true
        },
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
        {required: ["zftp"]},
};
