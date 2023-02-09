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

import { ImperativeError, IO, Logger } from "@zowe/imperative";
import { CoreUtils, TRANSFER_TYPE_ASCII, TRANSFER_TYPE_ASCII_RDW, TRANSFER_TYPE_BINARY, TRANSFER_TYPE_BINARY_RDW } from "./CoreUtils";
import { IAllocateDataSetOption, ICopyDataSetOptions, IDataSetDetailedAllocationOptions, IDownloadDataSetOption, IUploadDataSetOption, TRACK } from "./DataSetInterface";
import { StreamUtils } from "./StreamUtils";
import { IFTPProgressHandler } from "./IFTPProgressHandler";

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
        const files = await connection.listDataset(dsn) ?? [];
        if (files.length === 0) {
            throw new ImperativeError({msg: `The dataset "${dsn}" doesn't exist.`});
        }

        const estimatedSize = parseInt(files[0].Used, 10) * TRACK;
        let encoding;
        if (option.encoding) {
            encoding= "sbd=(" + option.encoding + ",ISO8859-1)";
        }
        const transferType = option.transferType || TRANSFER_TYPE_ASCII;

        let buffer;
        let length;
        const stream = await connection.getDataset(dsn, transferType, true, encoding);
        if (option.localFile) {
            this.log.debug("Downloading data set '%s' to local file '%s' in transfer mode '%s'",
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
        let encoding;
        if (option.encoding) {
            encoding= "sbd=(" + option.encoding + ",ISO8859-1)";
            siteparm = option.dcb + " " + encoding;
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
     * Map the allocation details from a dataset returned from the zos-node-accessor package to IDs that it accepts for allocation purposes
     * @param ds Descriptor for dataset allocation options
     * @returns Object with mapping required for allocation purposes (BLOGKSIze vs blksz)
     */
    public static mapAllocationOptions(ds: any): IDataSetDetailedAllocationOptions {
        // supported options: https://github.com/IBM/zos-node-accessor/blob/1.0.x/lib/zosAccessor.js#LL122C68-L122C68
        return {
            volume: ds.volume, // Not supported by connection.allocateDataset
            recfm: ds.recfm,
            BLOCKSIze: ds.blksz, // Strange mapping
            lrecl: ds.lrecl,
            dsorg: ds.dsorg,
            // BLocks: ds.??? // Strage mapping + Not returned by connection.listDataset
            // CYlinders: ds.??? // Strage mapping + Not returned by connection.listDataset
            // TRacks: ds.??? // Strage mapping + Not returned by connection.listDataset
            // Directory: ds.??? // Strage mapping + Not returned by connection.listDataset
            // PRImary: ds.??? // Strage mapping + Not returned by connection.listDataset
            // SECondary: ds.??? // Strage mapping + Not returned by connection.listDataset
        };
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

    /**
     * Allocate a dataset using the properties from another dataset
     *
     * @param connection zos-doce-accessor connection
     * @param dsn fully-qualified dataset name without quotes to be allocated
     * @param like fully-qualified dataset name without quotes to be modeled after
     * @param options dataset allocation options to override the `like` dataset allocation details
     * @returns
     */
    public static async allocateLikeDataSet(connection: any, dsn: string, like: string, options?: IDataSetDetailedAllocationOptions): Promise<IDataSetDetailedAllocationOptions> {
        const newDs = await connection.listDataset(dsn) ?? [];
        if (newDs.length !== 0) {
            this.log.debug("Dataset %s already exists", dsn);
            return DataSetUtils.mapAllocationOptions(newDs);
        }

        this.log.debug("Allocate data set '%s' with similar attributes to '%s", dsn, like);
        const files = await connection.listDataset(like);

        this.log.debug("Found %d matching data sets", files.length);
        const filteredFiles: any[] = files?.map((file: any) => CoreUtils.addLowerCaseKeysToObject(file)) ?? [];
        if (filteredFiles.length === 0) {
            throw new ImperativeError({msg: "No datasets found: " + like});
        }
        const ds = filteredFiles.find((file: any) => file.dsname.toUpperCase() === like.toUpperCase());
        const option = { ...DataSetUtils.mapAllocationOptions(ds), ...(options ?? {})};

        this.log.debug("Allocation options to be used: %s", JSON.stringify(option));
        await connection.allocateDataset(dsn, option);
        return option;
    }

    /**
     * Helper method to split the dataset name from the member name
     *
     * @param name fully-qualified dataset name without quotes
     * @returns Object separating the dataset name and the member name
     */
    public static getDataSet(name: string): {dsn: string, member?: string} {
        const parts = name.replace(')', '').split('(');
        if (parts.length > 1) {
            return {
                dsn: parts[0],
                member: parts[1]
            };
        } else {
            return {
                dsn: name
            };
        }
    }

    /**
     * Copy Dataset
     *
     * @param connection zos-node-accessor connection
     * @param options All required options for copying a dataset
     * @param options.fromDsn fully-qualified SOURCE dataset name without quotes
     * @param options.toDsn fully-qualified TARGET dataset name without quotes
     * @param options.progress Optional: Task used to indicate the progress of this operation (not used yet)
     * @param options.replace Optional: Boolean used to force a dataset or member replacement
     */
    public static async copyDataSet(connection: any, options: ICopyDataSetOptions): Promise<void> {
        const fromDsn = DataSetUtils.getDataSet(options.fromDsn);
        this.log.debug("Source: %s", JSON.stringify(fromDsn));
        const toDsn = DataSetUtils.getDataSet(options.toDsn);
        this.log.debug("Target: %s", JSON.stringify(toDsn));

        if (!options.replace) {
            this.log.debug("Verify that the dataset (or member) does not already exist since we aren't allowed to replace it");
            const newDs = await connection.listDataset(toDsn.dsn) ?? [];
            if (newDs.length !== 0 && (await connection.listDataset(options.toDsn) ?? []).length !== 0) {
                throw new ImperativeError({msg: `Dataset ${options.toDsn} already exists`});
            }
        }

        const dataset = (await connection.listDataset(fromDsn.member ? fromDsn.dsn : options.fromDsn))?.map((f: any) => CoreUtils.addLowerCaseKeysToObject(f)) ?? [];
        if (dataset.length === 0) {
            throw new ImperativeError({msg: `The dataset "${fromDsn.dsn}" doesn't exist.`});
        }

        const content = dataset.find((file: any) => file.dsname.toUpperCase() === fromDsn.dsn.toUpperCase());
        this.log.debug("Select the transfer type based on the soruce dataset RECFM");
        let transferType = fromDsn.member ? TRANSFER_TYPE_ASCII : null;
        switch (content.recfm[0]) {
            case "V":
                transferType = TRANSFER_TYPE_BINARY_RDW;
                break;
            case "D":
                transferType = TRANSFER_TYPE_ASCII_RDW;
                break;
            default:
                transferType = transferType ?? TRANSFER_TYPE_BINARY;
                break;
        }

        this.log.debug("Download the contents of the source dataset: %s", JSON.stringify(options.fromDsn));
        const stream = await connection.getDataset("'"+options.fromDsn+"'", transferType, false);

        this.log.debug("Make sure the new dataset is allocated: %s", JSON.stringify(toDsn.dsn));
        const option = await DataSetUtils.allocateLikeDataSet(connection, toDsn.dsn, fromDsn.dsn, toDsn.member ? {dsorg: "PO"} : {dsorg: "PS"});

        this.log.debug("Upload the contents to the new dataset: %s", JSON.stringify(options.toDsn));
        await connection.uploadDataset(stream, "'"+options.toDsn+"'", transferType, option);
    }

    private static get log(): Logger {
        return Logger.getAppLogger();
    }
}
