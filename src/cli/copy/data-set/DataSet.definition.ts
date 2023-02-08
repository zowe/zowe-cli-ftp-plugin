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

export const CopyDataSetDefinition: ICommandDefinition = {
    handler: __dirname + "/DataSet.Handler",
    description: "Copy the contents of a z/OS dataset to another z/OS dataset",
    type: "command",
    name: "data-set", aliases: ["ds"],
    summary: "Copy dataset or dataset member content",
    examples: [
        {
            description: "Copy the sequential data set \"ibmuser.seq.dataset\" to \"ibmuser.another.seq.dataset\"",
            options: "\"ibmuser.seq.dataset\" \"ibmuser.another.seq.dataset\""
        },
    ],
    positionals: [
        {
            name: "fromDataSetName",
            description: "The data set (PDS member or physical sequential data set) which you would like to copy the contents from.",
            type: "string",
            required: true
        },
        {
            name: "toDataSetName",
            description: "The data set (PDS member or physical sequential data set) which you would like to copy the contents to.",
            type: "string",
            required: true
        },
    ],
    options: [
        {
            name: "replace",
            aliases: ["rep"],
            description: "Specify this option as true if you wish to replace like-named members in the target dataset",
            type: "boolean"
        }
    ],
    profile: { optional: ["zftp"] },
};
