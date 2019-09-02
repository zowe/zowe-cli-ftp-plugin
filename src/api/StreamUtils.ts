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

import { IHandlerResponseApi, ITaskWithStatus, TaskStage, TextUtils } from "@brightside/imperative";
import { Readable, Writable } from "stream";

export class StreamUtils {

    /**
     *
     * @param  stremPromise - promise that will resolve to a readable stream
     * @param  response - response object from your handler, provide if
     *                                         you want a progress bar created
     * @returns  - promise that resolves when the h
     */
    public static async streamToBuffer(streamPromise: Promise<Readable>, response?: IHandlerResponseApi): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            let data: Buffer = Buffer.from([]);
            const statusMessage = "Downloaded %d of ? bytes";
            const task: ITaskWithStatus = {
                statusMessage: "Starting transfer...",
                percentComplete: 0,
                stageName: TaskStage.IN_PROGRESS
            };
            if (response != null) {
                response.progress.startBar({task});
            }
            streamPromise.then((stream) => {
                stream.on("data", (chunk: Buffer) => {
                    data = Buffer.concat([data, chunk]);
                    task.statusMessage = TextUtils.formatMessage(statusMessage, data.length);
                });
                stream.on("end", () => {
                    response.progress.endBar();
                    resolve(data);
                });
                stream.on("error", (error: any) => {
                    response.progress.endBar();
                    reject(error);
                });
            }).catch((streamRejection: any) => {
                reject(streamRejection);
            });
        });
    }

    /**
     * Pipes the readable stream to the writable stream.
     *
     * @param  stremPromise - promise that will resolve to a readable stream
     * @param  writable - writable stream
     * @param  response - response object from your handler, provide if
     *                                         you want a progress bar created
     * @returns  - promise that resolves when the h
     */
    public static async streamToStream(streamPromise: Promise<Readable>, writable: Writable, response?: IHandlerResponseApi): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            let downloadedBytes = 0;
            const statusMessage = "Downloaded %d of ? bytes";
            const task: ITaskWithStatus = {
                statusMessage: "Starting transfer...",
                percentComplete: 0,
                stageName: TaskStage.IN_PROGRESS
            };
            if (response != null) {
                response.progress.startBar({task});
            }
            streamPromise.then((stream) => {
                stream.on("data", (chunk: Buffer) => {
                    downloadedBytes += chunk.length;
                    task.statusMessage = TextUtils.formatMessage(statusMessage, downloadedBytes);
                });
                stream.on("end", () => {
                    response.progress.endBar();
                    resolve("end");
                });
                stream.on("error", (error: any) => {
                    response.progress.endBar();
                    reject(error);
                });
                stream.pipe(writable);
            }).catch((streamRejection: any) => {
                reject(streamRejection);
            });
        });
    }
}
