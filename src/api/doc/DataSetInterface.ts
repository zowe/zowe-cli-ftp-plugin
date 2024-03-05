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

import { DatasetEntry } from "zos-node-accessor/lib/interfaces/DatasetEntry";
import { IFTPProgressHandler } from "./IFTPProgressHandler";

export interface IDatasetEntry extends DatasetEntry {}

export interface IDownloadDataSetOption {
    /**
     * Optional local file that the dowloaded dataset will be saved to.
     */
    localFile?: string;

    /**
     * Optional repsonse handler for progressing messages.
     */
    progress?: IFTPProgressHandler;

    /**
     * TRANSFER_TYPE_ASCII, TRANSFER_TYPE_BIANRY, TRANSFER_TYPE_ASCII_RDW, or TRANSFER_TYPE_BINARY_RDW defined in CoreUtils.
     */
    transferType?: string;

    /**
    * Optional encoding for download and upload of z/OS data set
    */
    encoding?: string;
}

export interface IUploadDataSetOption {
    /**
     * Optional content that will be uploaded, if `localFile` is not specified.
     */
    content?: Buffer | string;

    /**
     * Data control block (DCB). Refer to https://github.com/IBM/zos-node-accessor/tree/1.0.7#allocate
     */
    dcb?: string;

    /**
     * Optional local file that will be uploaded.
     */
    localFile?: string;

    /**
     * TRANSFER_TYPE_ASCII or TRANSFER_TYPE_BIANRY defined in CoreUtils.
     */
    transferType?: string;

    /**
    * Optional encoding for download and upload of z/OS data set
    */
    encoding?: string;
}

export interface IAllocateDataSetOption {

    /**
     * Data control block (DCB). Refer to https://github.com/IBM/zos-node-accessor/tree/1.0.7#allocate
     */
    dcb?: string;
}

