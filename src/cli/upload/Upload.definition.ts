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
import { UploadFileToDataSetDefinition } from "./file-to-data-set/FileToDataSet.definition";
import { UploadFileToUssFileDefinition } from "./file-to-uss-file/FileToUssFile.definition";
import { UploadStdinToUssFileDefinition } from "./stdin-to-uss-file/StdinToUssFile.definition";
import { UploadStdinToDataSetDefinition } from "./stdin-to-data-set/StdinToDataSet.definition";

const UploadDefinition: ICommandDefinition = {
    name: "upload", aliases: ["ul"],
    summary: "Upload data set and USS content",
    description: "Upload data set and USS content",
    type: "group",
    children: [UploadFileToDataSetDefinition, UploadStdinToDataSetDefinition, UploadStdinToUssFileDefinition, UploadFileToUssFileDefinition]
};

export = UploadDefinition;
