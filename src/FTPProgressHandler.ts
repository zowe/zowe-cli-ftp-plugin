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

import { IHandlerProgressApi, ITaskWithStatus, TaskStage, TextUtils } from "@zowe/imperative";
import { IFTPProgressHandler } from "./api/IFTPProgressHandler";

const PERCETAGE = 100;

export class FTPProgressHandler implements IFTPProgressHandler {

    private progress: IHandlerProgressApi;
    private estimated: boolean;

    private task: ITaskWithStatus;
    private processed: number;
    private total: number;
    private statusMessage: string;

    constructor(progress: IHandlerProgressApi, estimated = false) {
        this.progress = progress;
        this.estimated = estimated;
    }

    public start(total: number): void {
        this.total = total;
        this.processed = 0;
        if (this.estimated) {
            this.statusMessage = "Downloaded %d of %d (Estimated) bytes";
        } else {
            this.statusMessage = "Downloaded %d of %d bytes";
        }
        this.task = {
            statusMessage: "Starting transfer...",
            percentComplete: 0,
            stageName: TaskStage.IN_PROGRESS
        };
        this.progress.startBar({ task: this.task });
    }

    public worked(work: number): void {
        this.processed += work;
        this.task.percentComplete = PERCETAGE * this.processed / this.total;
        this.task.statusMessage = TextUtils.formatMessage(this.statusMessage, this.processed, this.total);
    }

    public end(): void {
        this.progress.endBar();
    }
}
