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
import { DeleteDataSetDefinition } from "./data-set/DataSet.definition";
import { DeleteUssFileDefinition } from "./uss-file/UssFile.definition";
import { DeleteJobDefinition } from "./job/Job.definition";

const DeleteDefinition: ICommandDefinition = {
    name: "delete", aliases: ["del"],
    summary: "Delete data sets, jobs, and USS files",
    description: "Delete data sets, jobs, and USS files",
    type: "group",
    children: [DeleteDataSetDefinition, DeleteJobDefinition, DeleteUssFileDefinition]
};

export = DeleteDefinition;
