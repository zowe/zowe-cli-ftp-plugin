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

export class JobUtils {

    /**
     * Identify a job by job ID
     * Warning: slow since it lists all jobs
     * @param  jobId - the job ID of the job you want to identify -
     *                         note: you can't use the abbreviated version like j123. it must be the full job ID
     * @param connection - connection to zos-node-accessor
     */
    public static async findJobByID(jobId: string, connection: any) {
        this.log.debug("Attempting to locate job by job ID %s", jobId);
        jobId = jobId.toUpperCase();
        const job = await connection.getJobStatus({jobId, owner: "*"});
        return job;
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
