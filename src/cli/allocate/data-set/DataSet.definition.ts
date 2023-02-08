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
    description: "Allocate a sequential dataset or partitioned dataset with '--dcb \"PDSTYPE=PDS\"'",
    type: "command",
    name: "data-set", aliases: ["ds"],
    summary: "Allocate a sequential or partitioned dataset",
    examples: [
        {
            description: "Allocate a sequential dataset \"IBMUSER.DATASET\"",
            options: "\"IBMUSER.DATASET\""
        },
        {
            description: "Allocate a partitioned dataset \"IBMUSER.DATASET\"",
            options: "\"IBMUSER.DATASET\" --dcb \"PDSTYPE=PDS\""
        },
        {
            description: "Allocate a dataset \"IBMUSER.NEW.DATASET\" " +
            "with the same attributes as \"IBMUSER.ORIGINAL.DATASET\"",
            options: "\"IBMUSER.NEW.DATASET\" --like \"IBMUSER.ORIGINAL.DATASET\""
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
            "It's space separated like \"RECFM=FB LRECL=326 BLKSIZE=23472\". " +
            "For the list of possible DCB parameters, " +
            "visit https://github.com/IBM/zos-node-accessor/tree/1.0.x#allocate.",
            type: "string"
        },
        {
            name: "like", aliases: [],
            description: "Dataset name to copy the attributes from.",
            required: true,
            type: "string"
        }
    ],
    profile:
        {optional: ["zftp"]}
};
