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

import { FTPBaseHandler } from "../../../FTPBase.Handler";
import { IFTPHandlerParams } from "../../../IFTPHandlerParams";
import { JobUtils } from "../../../api";

export default class ListJobsHandler extends FTPBaseHandler {

    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        const options = {
            owner: params.arguments.owner,
            status: params.arguments.status
        };
        const filteredJobs = await JobUtils.listJobs(params.connection, params.arguments.prefix, options);
        params.response.data.setObj(filteredJobs);
        params.response.data.setMessage("Successfully listed %d matching jobs", filteredJobs.length);
        params.response.format.output({
            output: filteredJobs,
            format: "table",
            fields: ["jobId", "jobName", "owner", "status"]
        });
    }
}

