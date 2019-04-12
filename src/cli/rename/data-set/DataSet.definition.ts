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


export const RenameDataSetDefinition: ICommandDefinition = {
    handler: __dirname + "/DataSet.Handler",
    description: "Rename a cataloged data set",
    type: "command",
    name: "data-set", aliases: ["ds"],
    summary: "Rename a cataloged data set",
    examples: [
        {
            description: "Rename the data set ibmuser.jcl to ibmuser.cntl",
            options: "ibmuser.jcl ibmuser.cntl"
        },
        {
            description: "Rename the data set member \"ibmuser.cntl(alloc)\" to \"ibmuser.cntl(alloc2)\". Note: " +
            "you can only rename members within the same partitioned data set. You cannot move a member " +
            "to another data set with this command.",
            options: "\"ibmuser.cntl(alloc)\" \"ibmuser.cntl(alloc2)\""
        }
    ],
    positionals: [
        {
            name: "oldDataSet",
            description: "The current name of the data set you want to rename.",
            type: "string",
            required: true
        },
        {
            name: "newDataSet",
            description: "The new name for the data set.",
            type: "string",
            required: true
        }
    ],
    profile:
        {required: ["zftp"]},
};
