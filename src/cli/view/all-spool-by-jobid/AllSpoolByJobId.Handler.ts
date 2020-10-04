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
import { ImperativeError, TextUtils } from "@zowe/imperative";

export default class ViewAllSpoolByJobIdHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        this.log.debug("Viewing all spool files for job id: " + params.arguments.jobid);
        const spoolFiles: any = [];
        const fullSpoolFiles: any = [];
        const jobDetails = (await JobUtils.findJobByID(params.connection, params.arguments.jobid));
        if (jobDetails.spoolFiles == null || jobDetails.spoolFiles.length === 0) {
            throw new ImperativeError({
                msg: TextUtils.formatMessage("No spool files were available for job %s(%s). " +
                    "Try again after waiting a moment if the job is not yet in OUTPUT status.",
                    jobDetails.jobname, jobDetails.jobid)
            });
        }
        for (const spoolFileToDownload of jobDetails.spoolFiles) {
            this.log.debug("Requesting spool files for job %s(%s) spool file ID %d", jobDetails.jobname, jobDetails.jobid, spoolFileToDownload.id);
            const option = {
                jobName: jobDetails.jobname,
                jobId: jobDetails.jobid,
                owner: "*",
                fileId: spoolFileToDownload.id
            };
            const spoolFile = await JobUtils.getSpoolFileById(params.connection, option);
            spoolFiles.push(spoolFile);
            spoolFileToDownload.contents = spoolFile;
            fullSpoolFiles.push(spoolFileToDownload);
        }
        params.response.data.setObj(fullSpoolFiles);
        params.response.console.log(spoolFiles.join("\n"));
    }
}

