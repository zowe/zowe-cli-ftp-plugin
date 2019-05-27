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
import { ListJobsDefinition } from "./jobs/Jobs.definition";
import { ListDataSetDefinition } from "./data-set/DataSet.definition";
import { ListUssFilesDefinition } from "./uss-files/UssFiles.definition";
import { SpoolFilesByJobidDefinition } from "./spool-files-by-jobid/SpoolFilesByJobid.definition";
import { FTPConfig } from "../../api/FTPConfig";

const ListDefinition: ICommandDefinition = {
    name: "list", aliases: ["ls"],
    summary: "List data sets, uss files, jobs, spool files",
    description: "List data sets, uss files, jobs, spool files",
    type: "group",
    children: [ListJobsDefinition, ListDataSetDefinition, SpoolFilesByJobidDefinition, ListUssFilesDefinition],
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

export = ListDefinition;
