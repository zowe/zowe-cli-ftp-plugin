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

import { ImperativeError, TextUtils } from "@zowe/imperative";

import { FTPBaseHandler } from "../../../FTPBase.Handler";
import { IFTPHandlerParams } from "../../../IFTPHandlerParams";
import { JobUtils } from "../../../api/JobInterface";

export default class ViewAllSpoolByJobIdHandler extends FTPBaseHandler {

    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        const jobId = params.arguments.jobid;
        this.log.debug("Viewing all spool files for job id: " + jobId);

        const fullSpoolFiles = await JobUtils.getSpoolFiles(params.connection, jobId);
        if (fullSpoolFiles.length === 0) {
            throw new ImperativeError({
                msg: TextUtils.formatMessage("No spool files were available for job %s. " +
                    "Try again after waiting a moment if the job is not yet in OUTPUT status.",
                    jobId)
            });
        }
        params.response.data.setObj(fullSpoolFiles);
        params.response.console.log(fullSpoolFiles.map((spoolFile) => spoolFile.contents).join("\n"));
    }
}
