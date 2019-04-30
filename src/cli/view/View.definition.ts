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
import { ViewDataSetDefinition } from "./data-set/DataSet.definition";
import { ViewUssFileDefinition } from "./uss-file/UssFile.definition";
import { ViewAllSpoolByJobidDefinition } from "./all-spool-by-jobid/AllSpoolByJobId.definition";
import { ViewJobStatusByJobidDefinition } from "./job-status-by-jobid/JobStatusByJobid.definition";
import { ViewSpoolFileByIdDefinition } from "./spool-file-by-id/SpoolFileById.definition";

const ViewDefinition: ICommandDefinition = {
    name: "view", aliases: ["vw"],
    summary: "View data set, job output, and USS content",
    description: "View data sets, job output, and USS content",
    type: "group",
    children: [ViewDataSetDefinition, ViewSpoolFileByIdDefinition,
        ViewJobStatusByJobidDefinition, ViewUssFileDefinition, ViewAllSpoolByJobidDefinition]
};

export = ViewDefinition;
