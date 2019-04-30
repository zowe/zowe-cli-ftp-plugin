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


export const DeleteDataSetDefinition: ICommandDefinition = {
    handler: __dirname + "/DataSet.Handler",
    description: "Delete a data set",
    type: "command",
    name: "data-set", aliases: ["ds"],
    summary: "Delete a data set",
    examples: [
        {
            description: "Delete the data set \"ibmuser.cntl\"",
            options: "\"ibmuser.cntl\" -f"
        }
    ],
    positionals: [
        {
            name: "dataSet",
            description: "The data set (PDS member or physical sequential data set) which you would like to " +
            "delete.",
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
        }],
    profile:
        {required: ["zftp"]},
};
