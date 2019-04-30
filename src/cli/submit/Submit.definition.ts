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
import { SubmitLocalFileDefinition } from "./local-file/LocalFile.definition";
import { SubmitDataSetDefinition } from "./data-set/DataSet.definition";
import { SubmitStdinDefinition } from "./stdin/Stdin.definition";

const SubmitDefinition: ICommandDefinition = {
    name: "submit", aliases: ["sub"],
    summary: "Submit jobs from local files and data sets",
    description: "Submit jobs from local files and data sets",
    type: "group",
    children: [SubmitLocalFileDefinition, SubmitDataSetDefinition, SubmitStdinDefinition]
};

export = SubmitDefinition;
