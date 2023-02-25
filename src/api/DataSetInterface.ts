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

import { IFTPProgressHandler } from "./IFTPProgressHandler";

/**
 * Bytes per track.
 */
export const TRACK = 56664;

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

/**
 * Copy Dataset Options
 */
export interface ICopyDataSetOptions {
    /**
     * Required: Name of the SOURCE dataset
     */
    fromDsn: string;

    /**
     * Required: Name of the TARGET dataset
     */
    toDsn: string;

    /**
     * Optional: Progress indicator object/task
     */
    progress?: IFTPProgressHandler;

    /**
     * Optional: Indicator to force a replacement
     */
    replace?: boolean;
}

/**
 * Detailed allocation options for a dataset
 */
export interface IDataSetDetailedAllocationOptions {
    /**
     * Dataset volume serial
     */
    volume?: string; // Not supported by connection.allocateDataset

    /**
     * Dataset record format
     */
    recfm?: string;

    /**
     * Dataset block size
     */
    BLOCKSIze?: string; // Strange mapping

    /**
     * Dataset record length
     */
    lrecl?: string;

    /**
     * Dataset organization (PS vs PO)
     */
    dsorg?: string;

    /**
     * The following values are not supported by the allocateDataset method of zos-node-accessor@v1
     * However, they are return as allocation details for a dataset
     */
    // BLocks: ds.??? // Strage mapping + Not returned by connection.listDataset
    // CYlinders: ds.??? // Strage mapping + Not returned by connection.listDataset
    // TRacks: ds.??? // Strage mapping + Not returned by connection.listDataset
    // Directory: ds.??? // Strage mapping + Not returned by connection.listDataset
    // PRImary: ds.??? // Strage mapping + Not returned by connection.listDataset
    // SECondary: ds.??? // Strage mapping + Not returned by connection.listDataset
}

// When DataSetUtilsV2 for zos-node-accessor v2 is ready, alias DataSetUtilsV2 to DataSetUtils.
// export { DataSetUtils as DataSetUtils };
