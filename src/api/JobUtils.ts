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
import { IGetSpoolFileOption, IJob, IJobStatus, IListJobOption, ISpoolFile } from "./JobInterface";

export class JobUtils {

    /**
     * Lists jobs with the job name prefix.
     *
     * @param connection - zos-node-accessor connection
     * @param prefix - job name prefix
     * @param option - list job option
     * @returns job entries
     */
    public static async listJobs(connection: any, prefix: string, option?: IListJobOption): Promise<IJob[]> {
        const accessorOption: any = {
            jobName: prefix || "*",
        };
        let debugMessage = `Listing jobs that match prefix ${prefix}`;
        if (option && option.owner) {
            accessorOption.owner = option.owner;
            debugMessage += ` and are owned by ${accessorOption.owner}`;
        }
        if(option && option.status) {
            accessorOption.status = option.status;
            debugMessage += ` and status is ${accessorOption.status}`;
        }
        this.log.debug(debugMessage);

        const jobs = await connection.listJobs(accessorOption);
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
    public static async getSpoolFileContent(connection: any, option: IGetSpoolFileOption): Promise<Buffer> {
        return connection.getJobLog(option);
    }

    /**
     * Return the all job spool files content of the specified job id.
     *
     * @param connection - zos-node-accessor connection
     * @param jobId - job ID
     * @returns spool files with content
     */
    public static async getSpoolFiles(connection: any, jobId: string): Promise<ISpoolFile[]> {
        const jobDetails = (await JobUtils.findJobByID(connection, jobId));
        const fullSpoolFiles: ISpoolFile[] = [];
        if (jobDetails.spoolFiles) {
            for (const spoolFileToDownload of jobDetails.spoolFiles) {
                this.log.debug("Requesting spool files for job %s(%s) spool file ID %d", 
                    jobDetails.jobname, jobDetails.jobid, spoolFileToDownload.id);
                const option = {
                    jobName: jobDetails.jobname,
                    jobId: jobDetails.jobid,
                    owner: "*",
                    fileId: spoolFileToDownload.id
                };
                const spoolFile = await JobUtils.getSpoolFileContent(connection, option);
                spoolFileToDownload.contents = spoolFile;
                fullSpoolFiles.push(spoolFileToDownload);
            }
        }
        return fullSpoolFiles;
    }

    /**
     * Submits job with the specified JCL.
     *
     * @param connection - zos-node-accessor connection
     * @param jcl - jcl
     * @returns job id
     */
    public static async submitJob(connection: any, jcl: string): Promise<string> {
        return connection.submitJCL(jcl);
    }

    /**
     * Submits job with the specified JCL dataset.
     *
     * @param connection - zos-node-accessor connection
     * @param dsn - fully-qualified JCL dataset name without quotes
     * @returns job id
     */
    public static async submitJobFromDataset(connection: any, dsn: string): Promise<string> {
        const dsContent = (await connection.getDataset("'" + dsn + "'")).toString();
        this.log.debug("Downloaded data set '%s'. Submitting...", dsn);
        return JobUtils.submitJob(connection, dsContent);
    }

    /**
     * Identify a job by job ID
     * Warning: slow since it lists all jobs
     * @param  jobId - the job ID of the job you want to identify -
     *                         note: you can't use the abbreviated version like j123. it must be the full job ID
     * @param connection - connection to zos-node-accessor
     */
    public static async findJobByID(connection: any, jobId: string): Promise<IJobStatus> {
        this.log.debug("Attempting to locate job by job ID %s", jobId);
        const jobStatus = await connection.getJobStatus({jobId: jobId.toUpperCase(), owner: "*"});
        if (jobStatus.retcode) {
            // zos-node-accessor returns 'RC 0000', which need be converted to 'CC 0000'.
            jobStatus.retcode = jobStatus.retcode.replace(/^RC /, "CC ");
        }
        return jobStatus;
    }

    public static parseJobDetails(jobs: string[]): IJob[] {
        if (jobs.length > 1) {
            jobs = jobs.slice(1);
        }
        return jobs.map((job: string) => {
            // object looks like:
            // JOBNAME, JOBID, OWNER, STATUS, CLASS
            // turn the object into a similar format to that returned by
            // z/osmf so that users who use the list ds command in main
            // zowe can use the same filtering options
            const fields = job.split(/\s+/g);

            const jobNameIndex = 0;
            const jobIdIndex = 1;
            const ownerIndex = 2;
            const statusIndex = 3;
            const classIndex = 4;
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
