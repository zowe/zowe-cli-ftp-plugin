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

import * as PATH from "path";
import * as fs from "fs";

import { IHandlerResponseConsoleApi, IO, Logger } from "@zowe/imperative";
import { CoreUtils, TRANSFER_TYPE_ASCII } from "./CoreUtils";
import { StreamUtils } from "./StreamUtils";
import { IDeleteFileOption, IDownloadFileOption, IUploadFileOption } from "./UssInterface";

export class UssUtils {

    /**
     * Lists files under the specified directory.
     *
     * @param connection - zos-node-accessor connection
     * @param directory - directory to list
     * @returns file entries
     */
    public static async listFiles(connection: any, directory: string): Promise<any[]> {
        this.log.debug("Listing USS files in the directory '%s'", directory);
        const files = await connection.listDataset(directory);

        this.log.debug("Found %d matching files", files.length);
        const filteredFiles = files.map((file: any) => CoreUtils.addLowerCaseKeysToObject(file));
        return filteredFiles;
    }

    /**
     * Makes directory.
     *
     * @param connection - zos-node-accessor connection
     * @param directory - directory to make
     */
    public static async makeDirectory(connection: any, directory: string): Promise<void> {
        this.log.debug("Attempting to make USS directory '%s'", directory);
        await connection.makeDirectory(directory);
    }

    /**
     * Renames file or directory.
     *
     * @param connection - zos-node-accessor connection
     * @param oldNanme - old name of file or directory
     * @param newName - new name of file or directory
     */
    public static async renameFile(connection: any, oldNanme: string, newName: string): Promise<void> {
        this.log.debug("Attempting to rename USS file or directory from '%s' to '%s'", oldNanme, newName);
        await connection.rename(oldNanme, newName);
    }

    /**
     * Deletes file or directory.
     *
     * @param connection - zos-node-accessor connection
     * @param fileOrDir - file or directory
     * @param option - delete file option
     */
    public static async deleteFile(connection: any, fileOrDir: string, option?: IDeleteFileOption): Promise<void> {
        this.log.debug("Deleting USS file '%s'", fileOrDir);

        if (option && option.recursive) {
            await UssUtils.deleteDirectory(connection, fileOrDir, option.console);
        } else {
            await connection.deleteDataset(fileOrDir);
        }
    }

    /**
     * Downloads file.
     *
     * @param connection - zos-node-accessor connection
     * @param ussFile - file path name
     * @param option - download option
     * @returns promise to return buffer when accomplished. If `localFile` is specified, return undefined.
     */
    public static async downloadFile(connection: any, ussFile: string, option: IDownloadFileOption): Promise<Buffer> {
        const transferType = option.transferType || TRANSFER_TYPE_ASCII;

        let buffer;
        let length;
        const stream = await connection.getDataset(ussFile, transferType, true);
        if (option.localFile) {
            this.log.debug("Downloading USS file '%s' to local file '%s' in transfer mode '%s", ussFile, option.localFile, transferType);
            IO.createDirsSyncFromFilePath(option.localFile);
            const writable = fs.createWriteStream(option.localFile);
            length = await StreamUtils.streamToStream(option.size, stream, writable, option.response);
        } else {
            this.log.debug("Downloading USS file '%s' in transfer mode '%s", ussFile, transferType);
            buffer = await StreamUtils.streamToBuffer(option.size, stream, option.response);
            length = buffer.byteLength;
        }
        this.log.info("Successfully downloaded %d bytes of content from %s", length, ussFile);
        return Promise.resolve(buffer);
    }

    /**
     * Uploads file.
     *
     * @param connection - zos-node-accessor connection
     * @param ussFile - file path name
     * @param option - upload option
     */
    public static async uploadFile(connection: any, ussFile: string, option: IUploadFileOption): Promise<void> {
        const transferType = option.transferType || TRANSFER_TYPE_ASCII;
        let content = option.content;
        if (option.localFile) {
            this.log.debug("Attempting to upload from local file '%s' to USS file '%s' in transfer mode '%s'",
                option.localFile, ussFile, transferType);
            content = IO.readFileSync(option.localFile, undefined, transferType === "binary");
        } else {
            this.log.debug("Attempting to upload to USS file'%s' in transfer mode '%s'", ussFile, transferType);
        }
        if (transferType === TRANSFER_TYPE_ASCII) {
            // if we're in ascii mode, we need carriage returns to avoid errors
            content = Buffer.from(CoreUtils.addCarriageReturns(content.toString()));
        }
        await connection.uploadDataset(content, ussFile, transferType);
    }

    /**
     * Try to make sure a unix path conforms to what ftp expects
     * Includes fixing paths that are messed up by git for windows tools
     * like turning paths /u/users into U:/Users
     * @param path - the path to normalize
     * @returns the normalized path
     */
    public static normalizeUnixPath(path: string): string {
        this.log.debug("Normalizing unix path %s", path);
        // let's fix windows-ported unix tools trying to be helpful by converting paths to
        // windows style paths
        path = path.trim();
        const windowsStylePathPattern = /^([A-Z]+):\//i;
        const doubleSlashPattern = /^\/\//g;
        if (windowsStylePathPattern.test(path)) {
            const normalizedPath = path.replace(windowsStylePathPattern,
                (overallMatch: string, driveLetter: string) => {
                    return "/" + driveLetter.toLowerCase() + "/";
                });
            this.log.debug("Path has been normalized to %s", normalizedPath);
            return normalizedPath;
        } else if (doubleSlashPattern.test(path)) {
            // if the path starts with two slashes to avoid the 'correction'
            // then we will remove one of the slashes
            const normalizedPath = path.replace(doubleSlashPattern, "/");
            this.log.debug("Users specified two slashes at the beginning of the path, " +
                "possibly to avoid MSYS path correction. Replacing two slashes with one. Result: %s", normalizedPath);
            return normalizedPath;
        } else {
            this.log.debug("Path was already normalized. Using the path as-is.");
            return path;
        }
    }

    public static async deleteDirectory(connection: any, dir: string, response?: IHandlerResponseConsoleApi): Promise<void> {
        const files = await connection.listDataset(dir);
        for (const file of files) {
            const filePath = PATH.join(dir, file.name);
            if (file.isDirectory) {
                await this.deleteDirectory(connection, filePath, response);
            } else {
                await connection.deleteDataset(filePath);
                if (response) {
                    response.log("Deleted %s", filePath);
                }
            }
        }
        await connection.deleteDataset(dir);
        if (response) {
            response.log("Deleted %s", dir);
        }
    }

    private static get log(): Logger {
        return Logger.getAppLogger();
    }
}
