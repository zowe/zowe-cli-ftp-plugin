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

import { IO } from "@brightside/imperative";
import { JobUtils } from "../../../api/JobUtils";
import { FTPBaseHandler } from "../../../FTPBase.Handler";
import { IFTPHandlerParams } from "../../../IFTPHandlerParams";

export default class SubmitJobFromLocalFileHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        let jobDetails: any;
        let jobid: string;
        this.log.debug("Submitting a job from local file %s", params.arguments.file);
        const fileContent = IO.readFileSync(params.arguments.file);
        jobid = await params.connection.submitJCL(fileContent);
        jobDetails = await JobUtils.findJobByID(jobid, params.connection);
        this.log.info("Submitted job successfully, jobname(jobid): %s(%s)", jobDetails.jobname, jobDetails.jobid);
        params.response.data.setObj(jobDetails);
        params.response.format.output({
            output: jobDetails,
            format: "object",
            fields: ["jobid", "jobname", "owner", "status"]
        });
    }
}

