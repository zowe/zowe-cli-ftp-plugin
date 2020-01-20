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
/**
 * Re-use the option definitions for this command from core
 */
// tslint:disable-next-line
import { DownloadOptions } from "@zowe/cli";

export const DownloadDataSetDefinition: ICommandDefinition = {
    handler: __dirname + "/DataSet.Handler",
    description: "Download the contents of a z/OS data set to a local file",
    type: "command",
    name: "data-set", aliases: ["ds"],
    summary: "Download data set content to a local file",
    examples: [
        {
            description: "Download the data set \"ibmuser.loadlib(main)\" in binary mode to the local file \"main.obj\"",
            options: "\"ibmuser.loadlib(main)\" -b -f main.obj"
        }
    ],
    positionals: [{
        name: "dataSet",
        description: "The data set (PDS member or physical sequential data set) which you would like to download to a local file.",
        type: "string",
        required: true
    }],
    options: [
        DownloadOptions.file,
        DownloadOptions.binary
    ].sort((a, b) => a.name.localeCompare(b.name)),
    profile:
        {optional: ["zftp"]},
};
