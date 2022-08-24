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

import * as fs from "fs";

import { IO, Logger } from "@zowe/imperative";
import { CoreUtils, TRANSFER_TYPE_ASCII, TRANSFER_TYPE_BINARY } from "./CoreUtils";
import { IAllocateDataSetOption, IDownloadDataSetOption, IUploadDataSetOption, TRACK } from "./DataSetInterface";
import { StreamUtils } from "./StreamUtils";

export class DataSetUtils {

    /**
     * Lists datasets with the specified dataset name pattern.
     *
     * @param connection - zos-node-accessor connection
     * @param pattern - dataset name pattern
     * @returns dataset entries
     */
    public static async listDataSets(connection: any, pattern: string): Promise<any[]> {
        this.log.debug("Listing data sets matching pattern '%s' via FTP", pattern);
        const files = await connection.listDataset(pattern);

        this.log.debug("Found %d matching data sets", files.length);
        const filteredFiles = files.map((file: any) => CoreUtils.addLowerCaseKeysToObject(file));
        return filteredFiles;
    }

    /**
     * Lists members of PDS dataset of the specified dataset name.
     *
     * @param connection - zos-node-accessor connection
     * @param dsn - fully-qualified dataset name without quotes
     * @returns member entries
     */
    public static async listMembers(connection: any, dsn: string): Promise<any[]> {
        this.log.debug("List members of %s", dsn);

        const datasetname = dsn + "(*)";
        const members = await connection.listDataset(datasetname);

        this.log.debug("Found %d members", members.length);
        const filteredMembers = members.map((file: any) => CoreUtils.addLowerCaseKeysToObject(file));

        return filteredMembers;
    }

    /**
     * Delets the dataset of the specified dataset name.
     *
     * @param connection - zos-node-accessor connection
     * @param dsn - fully-qualified dataset name without quotes
     */
    public static async deleteDataSet(connection: any, dsn: string): Promise<void> {
        this.log.debug("Deleting data set '%s'", dsn);
        await connection.deleteDataset("'" + dsn + "'");
    }

    /**
     * Renames the dataset.
     *
     * @param connection - zos-node-accessor connection
     * @param oldDsn - old fully-qualified dataset name without quotes
     * @param newDsn - new fully-qualified dataset name without quotes
     */
    public static async renameDataSet(connection: any, oldDsn: string, newDsn: string): Promise<void> {
        this.log.debug("Attempting to rename data set from '%s' to '%s'", oldDsn, newDsn);
        await connection.rename(oldDsn, newDsn);
    }

    /**
     * Downloads the dataset. The contents will saved in local file, if localFile is provided in option. Otherwise, the contents
     * will be returned in Buffer.
     *
     * @param connection - zos-node-accessor connection
     * @param dsn - fully-qualified dataset name without quotes
     * @param option - download option
     * @returns dataset contents in Buffer, if localFile is not provided in option. Otherwise, undefined will be returned.
     */
    public static async downloadDataSet(connection: any, dsn: string, option: IDownloadDataSetOption): Promise<Buffer> {
        const files = await connection.listDataset(dsn);
        if (files === undefined || files.length === 0) {
            throw new Error(`The dataset "${dsn}" doesn't exist.`);
        }

        const estimatedSize = parseInt(files[0].Used, 10) * TRACK;
        if (option.encoding) {
            option.encoding= "sbd=(" + option.encoding + ",ISO8859-1)";
        }
        const transferType = option.transferType || TRANSFER_TYPE_ASCII;

        let buffer;
        let length;
        const stream = await connection.getDataset(dsn, transferType, true, option.encoding);
        if (option.localFile) {
            this.log.debug("Downloading data set '%s' to local file '%s' in transfer mode '%s",
                dsn, option.localFile, transferType);
            IO.createDirsSyncFromFilePath(option.localFile);
            const writable = fs.createWriteStream(option.localFile);
            length = await StreamUtils.streamToStream(estimatedSize, stream, writable, option.progress);
        } else {
            this.log.debug("Downloading data set '%s' in transfer mode '%s'", dsn, transferType);
            buffer = await StreamUtils.streamToBuffer(estimatedSize, stream, option.progress);
            length = buffer.byteLength;
        }
        this.log.info("Successfully downloaded %d bytes of content from %s", length, dsn);
        return Promise.resolve(buffer);
    }

    /**
     * Uploads the content to the specified dataset.
     *
     * @param connection - zos-node-accessor connection
     * @param dsn - fully-qualified dataset name without quotes
     * @param option - upload option
     */
    public static async uploadDataSet(connection: any, dsn: string, option: IUploadDataSetOption): Promise<void> {
        const transferType = option.transferType || TRANSFER_TYPE_ASCII;
        let content = option.content;
        let siteparm;
        if (option.encoding) {
            option.encoding = "sbd=(" + option.encoding + ",ISO8859-1)";
            siteparm = option.dcb + " " + option.encoding;
        } else {
            siteparm = option.dcb;
        }
        if (option.localFile) {
            this.log.debug("Attempting to upload from local file '%s' to data set '%s' in transfer mode '%s'",
                option.localFile, dsn, transferType);
            content = IO.readFileSync(option.localFile, undefined, transferType === TRANSFER_TYPE_BINARY);
        } else {
            this.log.debug("Attempting to upload to data set '%s' in transfer mode '%s'", dsn, option.transferType);
        }
        if (transferType === TRANSFER_TYPE_ASCII) {
            content = CoreUtils.addCarriageReturns(content.toString());
        }
        await connection.uploadDataset(content, "'" + dsn + "'", transferType, siteparm);
    }

    /**
     * Allocate dataset.
     *
     * @param connection - zos-node-accessor connection
     * @param dsn - fully-qualified dataset name without quotes
     * @param option - Allocate option
     */
    public static async allocateDataSet(connection: any, dsn: string, option: IAllocateDataSetOption): Promise<void> {
        this.log.debug("Allocate data set '%s'", dsn);
        await connection.allocateDataset(dsn, option.dcb);
    }

    private static get log(): Logger {
        return Logger.getAppLogger();
    }
}
