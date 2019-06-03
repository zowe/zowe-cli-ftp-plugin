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

import { JobUtils } from "../../../api/JobUtils";
import { FTPBaseHandler } from "../../../FTPBase.Handler";
import { IFTPHandlerParams } from "../../../IFTPHandlerParams";

export default class ListJobsHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        let jobs: string[];
        const option: any = {
            jobName: params.arguments.prefix,
        };
        let debugMessage = `Listing jobs that match prefix ${params.arguments.prefix}`;
        if (params.arguments.owner) {
            option.owner = params.arguments.owner;
            debugMessage += ` and are owned by ${option.owner}`;
        }
        this.log.debug(debugMessage);
        jobs = await params.connection.listJobs(option);
        this.log.debug("List returned %d jobs", jobs.length);
        const filteredJobs = JobUtils.parseJobDetails(jobs);
        params.response.data.setObj(filteredJobs);
        params.response.data.setMessage("Successfully listed %d matching jobs", jobs.length);
        params.response.format.output({
            output: filteredJobs,
            format: "table",
            fields: ["jobid", "jobname", "owner", "status"]
        });
    }
}

