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

import { Readable, Writable } from "stream";
import { IFTPProgressHandler } from "./IFTPProgressHandler";

export class StreamUtils {

    /**
     * @param size - file size
     * @param stream - readable stream
     * @param progress - optional progress handler
     * @returns promise that resolves buffer when accomplished
     */
    public static async streamToBuffer(size: number, stream: Readable, progress?: IFTPProgressHandler): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            let data: Buffer = Buffer.from([]);
            if (progress != null) {
                progress.start(size);
            }
            stream.on("data", (chunk: Buffer) => {
                data = Buffer.concat([data, chunk]);
                if (progress != null) {
                    progress.worked(chunk.length);
                }
            });
            stream.on("end", () => {
                if (progress != null) {
                    progress.end();
                }
                resolve(data);
            });
            stream.on("error", (error: any) => {
                if (progress != null) {
                    progress.end();
                }
                reject(error);
            });
            stream.resume();
        });
    }

    /**
     * Pipes the readable stream to the writable stream.
     *
     * @param estimatedSize - estimated file size
     * @param stremPromise - promise that will resolve to a readable stream
     * @param writable - writable stream
     * @param progress - optional progress handler
     * @returns promise that resolves the downloaded bytes when accomplished
     */
    public static async streamToStream(
        size: number, stream: Readable, writable: Writable, progress?: IFTPProgressHandler): Promise<number> {

        return new Promise<number>((resolve, reject) => {
            let downloadedBytes = 0;
            const statusMessage = "Downloaded %d of %d bytes";
            if (progress != null) {
                progress.start(size);
            }
            stream.pipe(writable);
            stream.on("data", (chunk: Buffer) => {
                downloadedBytes += chunk.length;
                if (progress != null) {
                    progress.worked(chunk.length);
                }
            });
            stream.on("end", () => {
                if (progress != null) {
                    progress.end();
                }
                resolve(downloadedBytes);
            });
            stream.on("error", (error: any) => {
                if (progress != null) {
                    progress.end();
                }
                reject(error);
            });
        });
    }

}
