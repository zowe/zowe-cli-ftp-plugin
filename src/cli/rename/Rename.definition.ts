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
import { RenameDataSetDefinition } from "./data-set/DataSet.definition";
import { RenameUssFileDefinition } from "./uss-file/UssFile.definition";

const RenameDefinition: ICommandDefinition = {
    name: "rename", aliases: ["mv"],
    summary: "Rename data sets and USS files or directories",
    description: "Rename data sets and USS files or directories",
    type: "group",
    children: [RenameDataSetDefinition, RenameUssFileDefinition]
};

export = RenameDefinition;
