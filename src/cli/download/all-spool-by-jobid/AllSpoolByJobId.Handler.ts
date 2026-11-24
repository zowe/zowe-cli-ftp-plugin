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

import { ImperativeError, IO, TextUtils } from "@zowe/imperative";
import { FTPBaseHandler } from "../../../FTPBase.Handler";
import { IFTPHandlerParams } from "../../../IFTPHandlerParams";
import { JobUtils } from "../../../api";

export default class ViewAllSpoolByJobIdHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        this.log.debug("Downloading all spool files for job id: " + params.arguments.jobid);

        const destination = params.arguments.directory == null ? "./output/" : params.arguments.directory;
        const jobDetails = (await JobUtils.findJobByID(params.connection, params.arguments.jobid));
        if (jobDetails.spoolFiles == null || jobDetails.spoolFiles.length === 0) {
            throw new ImperativeError({
                msg: TextUtils.formatMessage("No spool files were available for job %s(%s). " +
                    "Try again after waiting a moment if the job is not yet in OUTPUT status.",
                jobDetails.jobName, jobDetails.jobId)
            });
        }
        const fullSpoolFiles = await JobUtils.getSpoolFiles(params.connection, jobDetails.jobId);
        for (const spoolFileToDownload of fullSpoolFiles) {
            const destinationFile = JobUtils.getSpoolDownloadFilePath({
                ddName: spoolFileToDownload.ddName || "UNKNOWN_DD",
                jobId: jobDetails.jobId,
                outDir: params.arguments.directory,
                procStep: spoolFileToDownload.procStep === "N/A" || spoolFileToDownload.procStep == null ?
                    undefined : spoolFileToDownload.procStep,
                stepName: spoolFileToDownload.stepName, omitJobidDirectory: params.arguments.omitJobidDirectory,
            });
            this.log.info("Downloading spool file %s to local file %s", spoolFileToDownload.ddName, destinationFile);
            IO.createDirsSyncFromFilePath(destinationFile);
            IO.writeFile(destinationFile, spoolFileToDownload.contents);
        }
        const successMessage = params.response.console.log("Successfully downloaded %d spool files to %s", fullSpoolFiles.length, destination);
        params.response.data.setMessage(successMessage);
        this.log.info(successMessage);
    }
}

