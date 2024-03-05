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

/**
 * "zos-ftp list spool-files" command handler. Outputs a table of spool files.
 */
export default class ListSpoolFilesByJobidHandler extends FTPBaseHandler {

    public async processFTP(params: IFTPHandlerParams): Promise<void> {

        this.log.debug("Listing spool files for job ID %s", params.arguments.jobId);
        const job = await JobUtils.findJobByID(params.connection, params.arguments.jobId);
        const files = job.spoolFiles;

        const successMessage = this.log.info(`"${files.length}" spool files obtained for job "${job.jobName}(${job.jobId})"`);
        // Set the object, message, and log the prettified object
        params.response.data.setObj(files);
        params.response.data.setMessage(successMessage);

        // Format & print the response
        params.response.format.output({
            fields: ["id", "ddname", "procstep", "stepname"],
            output: files,
            format: "table"
        });
    }
}
