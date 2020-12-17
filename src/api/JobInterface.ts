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

import { JobUtils } from "./JobUtils";

export interface IGetSpoolFileOption {
    /**
     * Job spool file ID.
     */
    fileId: string;

    /**
     * Job name. If it's unspecified, `*` will be used.
     */
    jobName?: string;

    /**
     * Job ID.
     */
    jobId: string;

    /**
     * Job owner. If it's unspecified, `*` will be used.
     */
    owner?: string;
}

export interface IListJobOption {
    /**
     * Job owner. If it's unspecified, `*` will be used.
     */
    owner?: string;
}

export interface IJob {
    /**
     * Job name
     */
    jobname: string;

    /**
     * Job ID
     */
    jobid: string;

    /**
     * Job owner
     */
    owner: string;

    /**
     * Job status
     */
    status: string;

    /**
     * Job class
     */
    class: string;

    /**
     * Extra information
     */
    extra?: string;
}

export interface ISpoolFile {
    /**
     * Spool file ID
     */
    id: string;

    /**
     * Job step name
     */
    stepname?: string;

    /**
     * Proc step name
     */
    procstep?: string;

    /**
     * Class
     */
    class?: string;

    /**
     * DD name
     */
    ddname?: string;

    /**
     * Bytes
     */
    byteCount?: number;

    /**
     * Contents
     */
    contents?: Buffer;
}

/**
 * Job status including rc, spool files, etc.
 */
export interface IJobStatus extends IJob {
    /**
     * Job RC value, indicating job finished with numberic value or failed with error string.
     */
    rc?: string | number;

    /**
     * Job RC value, to support zftp plugin with consistent return code format with z/OSMF.
     */
    retcode?: string;

    /**
     * Spool files.
     */
    spoolFiles?: ISpoolFile[];
}

// When JobUtilsV2 for zos-node-accessor v2 is ready, alias JobUtilsV2 to JobUtils.
export { JobUtils as JobUtils };
