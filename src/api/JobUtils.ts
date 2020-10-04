import { DownloadJobs, IJobFile } from "@zowe/cli";
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

import { Logger } from "@zowe/imperative";

export interface IGetSpoolByFileIdOption {
    fileId: string;
    jobName: string;
    jobId: string;
    owner: string;
}

export class JobUtils {

    /**
     * Lists jobs with the job name prefix.
     *
     * @param connection - zos-node-accessor connection
     * @param prefix - job name prefix
     * @param owner - optional owner
     * @returns job entries
     */
    public static async listJobs(connection: any, prefix: string, owner?: string): Promise<any[]> {
        const option: any = {
            jobName: prefix,
        };
        let debugMessage = `Listing jobs that match prefix ${prefix}`;
        if (owner) {
            option.owner = owner;
            debugMessage += ` and are owned by ${option.owner}`;
        }
        this.log.debug(debugMessage);

        const jobs = await connection.listJobs(option);
        this.log.debug("List returned %d jobs", jobs.length);
        const filteredJobs = JobUtils.parseJobDetails(jobs);
        return filteredJobs;
    }

    /**
     * Deletes the job with the job id.
     *
     * @param connection - zos-node-accessor connection
     * @param jobId - job id
     */
    public static async deleteJob(connection: any, jobId: string): Promise<void> {
        this.log.debug("Deleting job with job id '%s'", jobId);
        await connection.deleteJob(jobId);
    }

    /**
     * Return the job spool files content of the specified job id and spool file id.
     *
     * @param connection - zos-node-accessor connection
     * @param option - option
     * @returns spool file content
     */
    public static async getSpoolFileById(connection: any, option: IGetSpoolByFileIdOption): Promise<Buffer> {
        return connection.getJobLog(option);
    }

    /**
     * Submits job witht he specified JCL.
     *
     * @param connection - zos-node-accessor connection
     * @param jcl - jcl
     * @returns job id
     */
    public static async submitJob(connection: any, jcl: string): Promise<string> {
        return connection.submitJCL(jcl);
    }

    /**
     * Identify a job by job ID
     * Warning: slow since it lists all jobs
     * @param  jobId - the job ID of the job you want to identify -
     *                         note: you can't use the abbreviated version like j123. it must be the full job ID
     * @param connection - connection to zos-node-accessor
     */
    public static async findJobByID(connection: any, jobId: string) {
        this.log.debug("Attempting to locate job by job ID %s", jobId);
        return connection.getJobStatus({jobId: jobId.toUpperCase(), owner: "*"});
    }

    public static parseJobDetails(jobs: string[]): any[] {
        if (jobs.length > 1) {
            jobs = jobs.slice(1);
        }
        return jobs.map((job: any) => {
            // object looks like:
            // JOBNAME, JOBID, OWNER, STATUS, CLASS
            // turn the object into a similar format to that returned by
            // z/osmf so that users who use the list ds command in main
            // zowe can use the same filtering options
            const fields = job.split(/ /g);

            const jobNameIndex = 0;
            const jobIdIndex = 1;
            const ownerIndex = 2;
            const statusIndex = 3;
            const classIndex = 4;
            if (fields.length > classIndex + 1) {
                // console.log("Failed to parse this line: " + job);
            }
            return {
                jobname: fields[jobNameIndex],
                jobid: fields[jobIdIndex],
                owner: fields[ownerIndex],
                status: fields[statusIndex],
                class: fields[classIndex],
                originalFtpResult: job
            };
        });
    }

    private static get log(): Logger {
        return Logger.getAppLogger();
    }
}
