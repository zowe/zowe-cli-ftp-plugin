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
import { UssUtils } from "./UssUtils";

export interface IDownloadFileOption {
    /**
     * Optional local file that the dowloaded file will be saved to.
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
     * TRANSFER_TYPE_ASCII or TRANSFER_TYPE_BIANRY defined in CoreUtils.
     */
    transferType?: string;
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
     * TRANSFER_TYPE_ASCII or TRANSFER_TYPE_BIANRY defined in CoreUtils.
     */
    transferType?: string;
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

// When UssUtilsV2 for zos-node-accessor v2 is ready, alias UssUtilsV2 to UssUtils.
export { UssUtils as UssUtils };
