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

import { SpoolFile } from "zos-node-accessor/lib/interfaces/SpoolFile";
import { Job, JobStatus } from "zos-node-accessor/lib/interfaces/Job";
import { JobListOption } from "zos-node-accessor/lib/interfaces/JobListOption";
import { JobLogOption } from "zos-node-accessor/lib/interfaces/JobIdOption";

/**
 * Properties representing the options of a jobLog-query operation
 */
export interface IGetSpoolFileOption extends JobLogOption {}
/**
 * Properties representing the options of a job-list operation
 */
export interface IListJobOption extends JobListOption {}
/**
 * Properties representing a job
 */
export interface IJob extends Job {}
/**
 * Properties representing a spool file
 */
export interface ISpoolFile extends SpoolFile {}
/**
 * Properties representing the status of a job
 */
export interface IJobStatus extends JobStatus, IJob {
    // Need to extend `IJob` as well in case we add content to `IJob`
    /**
     * List of spool files
     */
    spoolFiles?: ISpoolFile[];
    // Need to keep the above property in case we add content to `ISpoolFile`
}
/**
 * Properties required for downloading spool contents
 */
export interface IDownloadSpoolContentParms {
    binary?: boolean;
    outDir?: string;
    extension?: string;
    jobId: string;
}
/**
 * Properties representing the file path of a download-spool operation
 */
export interface IGetSpoolDownloadFilePath extends IDownloadSpoolContentParms {
    ddName: string;
    procStep?: string;
    stepName?: string;
}