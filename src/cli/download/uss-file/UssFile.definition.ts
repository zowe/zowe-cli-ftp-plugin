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

export const DownloadUSSFileDefinition: ICommandDefinition = {
    handler: __dirname + "/UssFile.Handler",
    description: "Download the contents of a USS file to a local file",
    type: "command",
    name: "uss-file", aliases: ["uss"],
    summary: "Download USS file content to a local file",
    examples: [
        {
            description: "Download the USS file \"/u/users/ibmuser/main.obj\" in binary mode to the local file \"main.obj\"",
            options: "\"/u/users/ibmuser/main.obj\" -b -f main.obj"
        }
    ],
    positionals: [{
        name: "ussFile",
        description: "The path to the USS file you would like to download.",
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
