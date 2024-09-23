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

import { IHandlerResponseConsoleApi } from "@zowe/imperative";
import { IFTPProgressHandler } from "./IFTPProgressHandler";
import { USSEntry } from "zos-node-accessor/lib/interfaces/USSEntry";
import { TransferMode } from "zos-node-accessor";

export interface IUSSEntry extends USSEntry {}

export interface IDownloadFileOption {
    /**
     * Optional local file that the downloaded file will be saved to.
     */
    localFile?: string;

    /**
     * Optional repsonse handler for progressing messages.
     */
    progress?: IFTPProgressHandler;

    /**
     * File size in bytes or estimated file size.
     */
    size: number;

    /**
     * The type of transfer used to download the USS file
     */
    transferType?: TransferMode;
}

export interface IUploadFileOption {
    /**
     * Optional content that will be uploaded, if `localFile` is not specified.
     */
    content?: Buffer | string;

    /**
     * Optional local file that will be uploaded.
     */
    localFile?: string;

    /**
     * The type of transfer used to download the USS file
     */
    transferType?: TransferMode;
}

export interface IDeleteFileOption {

    /**
     * Optional console response handler.
     */
    console?: IHandlerResponseConsoleApi;

    /**
     * Recursively delete the child directories and the files.
     */
    recursive?: boolean;
}
