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


export const LikeDataSetDefinition: ICommandDefinition = {
    handler: __dirname + "/LikeDataSet.Handler",
    description: "Allocate a dataset with the same attributes as another dataset",
    type: "command",
    name: "like-data-set", aliases: ["like", "lds"],
    summary: "Allocate a dataset with similar attributes to another",
    examples: [
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
            name: "like", aliases: [],
            description: "Dataset name to copy the attributes from.",
            required: true,
            type: "string"
        }
    ],
    profile:
        {optional: ["zftp"]}
};
