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
import { JobUtils } from "../../../api/JobUtils";

/**
 * "zos-ftp view spool-by-id" command handler. Outputs a single spool DD contents.
 */
export default class SpoolFileByIdHandler extends FTPBaseHandler {

    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        this.log.debug("Getting spool file with id %s for job with ID %s", params.arguments.spoolfileid, params.arguments.jobid);
        // Get the content, set the JSON response object, and print
        const option = {
            jobName: "*",
            jobId: params.arguments.jobid,
            owner: "*",
            fileId: params.arguments.spoolfileid
        };

        /* Add await JobUtils.findJobByID(params.arguments.jobid, params.connection);
         * to avoid the list spool-files-by-jobid command and view spool-file-by-id making two separate FTP sessions.
         * And ensure the correct spool file can be retrieved.
         */

        await JobUtils.findJobByID(params.arguments.jobid, params.connection);
        const content: string = await params.connection.getJobLog(option);
        params.response.data.setObj(content);
        const successMessage = this.log.info(`Spool file "${params.arguments.spoolfileid}" content obtained for job ID "${params.arguments.jobid})"`);
        params.response.data.setMessage(successMessage);
        params.response.console.log(Buffer.from(content));
    }
}
