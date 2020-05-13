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
import { MakeUssDirectoryDefinition } from "./uss-directory/UssDirectory.definition";
import { FTPConfig } from "../../api/FTPConfig";

const MakeDefinition: ICommandDefinition = {
    name: "make", aliases: ["mk"],
    summary: "Make a USS directory",
    description: "Make a USS directory",
    type: "group",
    children: [MakeUssDirectoryDefinition],
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

export = MakeDefinition;
