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
import { AllocateDataSetDefinition } from "./data-set/DataSet.definition";
import { FTPConfig } from "../../api/FTPConfig";

const AllocateDefinition: ICommandDefinition = {
    name: "allocate", aliases: ["alloc"],
    summary: "Allocate a sequential dataset or partitioned dataset with '--dcb \"PDSTYPE=PDS\"'",
    description: "Allocate a sequential or partitioned dataset",
    type: "group",
    children: [AllocateDataSetDefinition],
    passOn: [
        {
            property: "options",
            value: FTPConfig.FTP_CONNECTION_OPTIONS,
            merge: true,
            ignoreNodes: [
                {type: "group"}
            ]
        }
    ]
};

export = AllocateDefinition;
