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

import { IHandlerResponseApi, ITaskWithStatus, TaskStage, TextUtils } from "@zowe/imperative";
import { Readable, Writable } from "stream";

export class StreamUtils {

    /**
     * @param estimatedSize - estimated file size
     * @param stream - readable stream
     * @param response - response object from your handler, if you want a progress bar created
     * @returns promise that resolves buffer when accomplished
     */
    public static async streamToBuffer(estimatedSize: number, stream: Readable, response?: IHandlerResponseApi): Promise<Buffer> {
        const PERCETAGE = 100;
        return new Promise<Buffer>((resolve, reject) => {
            let data: Buffer = Buffer.from([]);
            const statusMessage = "Downloaded %d of %d (Estimated) bytes";
            const task: ITaskWithStatus = {
                statusMessage: "Starting transfer...",
                percentComplete: 0,
                stageName: TaskStage.IN_PROGRESS
            };
            if (response != null) {
                response.progress.startBar({task});
            }
            stream.on("data", (chunk: Buffer) => {
                data = Buffer.concat([data, chunk]);
                task.percentComplete = PERCETAGE * data.length / estimatedSize;
                task.statusMessage = TextUtils.formatMessage(statusMessage, data.length, estimatedSize);
            });
            stream.on("end", () => {
                if (response != null) {
                    response.progress.endBar();
                }
                resolve(data);
            });
            stream.on("error", (error: any) => {
                if (response != null) {
                    response.progress.endBar();
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
     * @param response - response object from your handler, if you want a progress bar created
     * @returns promise that resolves the downloaded bytes when accomplished
     */
    public static async streamToStream(
        estimatedSize: number, stream: Readable, writable: Writable, response?: IHandlerResponseApi): Promise<number> {

        const PERCETAGE = 100;
        return new Promise<number>((resolve, reject) => {
            let downloadedBytes = 0;
            const statusMessage = "Downloaded %d of %d bytes";
            const task: ITaskWithStatus = {
                statusMessage: "Starting transfer...",
                percentComplete: 0,
                stageName: TaskStage.IN_PROGRESS
            };
            if (response != null) {
                response.progress.startBar({task});
            }
            stream.pipe(writable);
            stream.on("data", (chunk: Buffer) => {
                downloadedBytes += chunk.length;
                task.percentComplete = PERCETAGE * downloadedBytes / estimatedSize;
                task.statusMessage = TextUtils.formatMessage(statusMessage, downloadedBytes, estimatedSize);
            });
            stream.on("end", () => {
                if (response != null) {
                    response.progress.endBar();
                }
                resolve(downloadedBytes);
            });
            stream.on("error", (error: any) => {
                if (response != null) {
                    response.progress.endBar();
                }
                reject(error);
            });
        });
    }
}
