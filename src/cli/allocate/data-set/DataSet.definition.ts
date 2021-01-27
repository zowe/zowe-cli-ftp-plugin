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


export const AllocateDataSetDefinition: ICommandDefinition = {
    handler: __dirname + "/DataSet.Handler",
    description: "Allocate a sequential or partitioned dataset",
    type: "command",
    name: "data-set", aliases: ["ds"],
    summary: "Allocate a sequential or partitioned dataset",
    examples: [
        {
            description: "Allocate a dataset \"IBMUSER.DATASET\"",
            options: "\"IBMUSER.DATASET\""
        }
    ],
    positionals: [{
        name: "datasetName",
        description: "The dataset name you'd like to allocate.",
        type: "string",
        required: true
    }],
    options: [
        {
            name: "dcb", aliases: [],
            description: "DCB parameters for dataset allocation. " +
            "It's space separated like RECFM=FB LRECL=326 BLKSIZE=23472",
            type: "string"
        }
    ],
    profile:
        {optional: ["zftp"]}
};
