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

import { IHandlerResponseConsoleApi, IO, ImperativeError, Logger } from "@zowe/imperative";
import { CoreUtils } from "./CoreUtils";
import { StreamUtils } from "./StreamUtils";
import { IDeleteFileOption, IDownloadFileOption, IUSSEntry, IUploadFileOption } from "./doc/UssInterface";
import { TransferMode, ZosAccessor } from "zos-node-accessor";
import { ReadStream } from "fs";
import { ITransferMode } from "./doc/constants";

export class UssUtils {

    /**
     * Lists files under the specified directory.
     *
     * @param connection - zos-node-accessor connection
     * @param directory - directory to list
     * @returns file entries
     */
    public static async listFiles(connection: ZosAccessor, directory: string): Promise<IUSSEntry[]> {
        this.log.debug("Listing USS files in the directory '%s'", directory);

        // Only support wildcard matching in file names as follows.
        //     "/dir1/dir2"
        //     "/dir1/dir2/file*"       => /^file.*$/
        //     "/dir1/dir2/*suffix"     => /^.*suffix$/
        //     "/dir1/dir2/file*suffix" => /^file.*suffix$/
        let directoryToList = directory;
        const slashPosn = directory.lastIndexOf("/");
        let filter: (fileName: string) => boolean;
        if (slashPosn !== -1) {
            const lastPart = directory.substring(slashPosn + 1);
            if (lastPart.indexOf("*") !== -1) {
                directoryToList = directory.substring(0, slashPosn);
                const pattern = "^" + lastPart.replace(/\*/g, ".*") + "$";
                filter = (fileName: string) => (fileName.match(pattern) != null);
                this.log.debug("Listing USS files in the directory '%s' with pattern '%s'", directoryToList, pattern);
            }
        }
        let files = await connection.listFiles(directoryToList);
        if (filter) {
            files = files.filter((file: IUSSEntry) => filter(file.name));
        }

        this.log.debug("Found %d matching files", files.length);
        const filteredFiles = files.map((file: IUSSEntry) => CoreUtils.addLowerCaseKeysToObject(file));
        return filteredFiles as IUSSEntry[];
    }

    /**
     * Makes directory.
     *
     * @param connection - zos-node-accessor connection
     * @param directory - directory to make
     */
    public static async makeDirectory(connection: ZosAccessor, directory: string): Promise<void> {
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
    public static async renameFile(connection: ZosAccessor, oldNanme: string, newName: string): Promise<void> {
        this.log.debug("Attempting to rename USS file or directory from '%s' to '%s'", oldNanme, newName);
        await connection.renameFile(oldNanme, newName);
    }

    /**
     * Deletes file or directory.
     *
     * @param connection - zos-node-accessor connection
     * @param fileOrDir - file or directory
     * @param option - delete file option
     */
    public static async deleteFile(connection: ZosAccessor, fileOrDir: string, option?: IDeleteFileOption): Promise<void> {
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
    public static async downloadFile(connection: ZosAccessor, ussFile: string, option: IDownloadFileOption): Promise<Buffer> {
        const transferType = (option.transferType || ITransferMode.ASCII) as TransferMode;
        let buffer;
        let length;
        const stream = await connection.downloadFile(ussFile, transferType, true) as ReadStream;
        if (option.localFile) {
            this.log.debug("Downloading USS file '%s' to local file '%s' in transfer mode '%s", ussFile, option.localFile, transferType);
            IO.createDirsSyncFromFilePath(option.localFile);
            const writable = fs.createWriteStream(option.localFile);
            length = await StreamUtils.streamToStream(option.size, stream, writable, option.progress);
        } else {
            this.log.debug("Downloading USS file '%s' in transfer mode '%s", ussFile, transferType);
            buffer = await StreamUtils.streamToBuffer(option.size, stream, option.progress);
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
    public static async uploadFile(connection: ZosAccessor, ussFile: string, option: IUploadFileOption): Promise<void> {
        const transferType = (option.transferType || ITransferMode.ASCII) as TransferMode;
        let content = option.content;
        if (option.localFile) {
            this.log.debug("Attempting to upload from local file '%s' to USS file '%s' in transfer mode '%s'",
                option.localFile, ussFile, transferType);
            content = IO.readFileSync(option.localFile, undefined, transferType === ITransferMode.BINARY);
        } else {
            this.log.debug("Attempting to upload to USS file'%s' in transfer mode '%s'", ussFile, transferType);
        }
        if (transferType === ITransferMode.ASCII) {
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

    public static async deleteDirectory(connection: ZosAccessor, dir: string, response?: IHandlerResponseConsoleApi): Promise<void> {
        const files = await connection.listDatasets(dir);
        for (const file of files) {
            const filePath = PATH.posix.join(dir, file.name);
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

    public static checkAbsoluteFilePath(filePath: string): string {
        if (!filePath.startsWith('/')) {
            throw new ImperativeError({ msg: "Please check the uss file path. The full file path is required." });
        } else {
            return filePath;
        }
    }

    private static get log(): Logger {
        return Logger.getAppLogger();
    }
}
