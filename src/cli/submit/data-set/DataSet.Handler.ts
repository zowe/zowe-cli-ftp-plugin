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

import { IO } from "@zowe/imperative";
import { JobUtils } from "../../../api/JobUtils";
import { FTPBaseHandler } from "../../../FTPBase.Handler";
import { IFTPHandlerParams } from "../../../IFTPHandlerParams";

export default class SubmitJobFromLocalFileHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        let jobDetails: any;
        let jobid: string;
        this.log.debug("Submitting a job from data set '%s'. Downloading before submitting...", params.arguments.dataSet);
        const dsContent = (await params.connection.getDataset("'" + params.arguments.dataSet + "'")).toString();
        this.log.debug("Downloaded data set '%s'. Submitting...", params.arguments.dataSet);
        jobid = await params.connection.submitJCL(dsContent);
        if (params.arguments.wait) {
            return new Promise((resolve, reject) => {
                const interval = 5000;
                let num = 0;
                const timerId = setInterval(async () => {
                    try {
                        jobDetails = await JobUtils.findJobByID(jobid, params.connection);
                        const status = jobDetails.status.toString();
                        if (status === "OUTPUT") {
                            // tslint:disable-next-line: no-shadowed-variable
                            const successMsg = params.response.console.log("Submitted job successfully!", jobDetails.jobname, jobDetails.jobid);
                            this.log.info(successMsg);
                            params.response.data.setObj(jobDetails);
                            params.response.format.output({
                                output: jobDetails,
                                format: "object",
                                fields: ["jobid", "jobname", "owner", "status", "rc"]
                            });
                            setTimeout(() => {
                                clearInterval(timerId);
                                resolve();
                            }, 0);
                            // tslint:disable-next-line: no-magic-numbers
                        } else if (num === 10) {
                            // tslint:disable-next-line: max-line-length
                            const stopcheckMsg = params.response.console.log("Job is runing, palease check status later!", jobDetails.jobname, jobDetails.jobid);
                            this.log.info(stopcheckMsg);
                            setTimeout(() => {
                                clearInterval(timerId);
                                resolve();
                            }, 0);
                        }
                        else {
                            const waitMsg = params.response.console.log("Job is runing, palease wait!", jobDetails.jobname, jobDetails.jobid);
                            this.log.info(waitMsg);
                            num = num + 1;
                        }
                    }
                    catch (err) {
                        const errMsg = params.response.console.log(err);
                        this.log.info(errMsg);
                        reject();
                    }
                }, interval);
            });
        }
        else {
            jobDetails = await JobUtils.findJobByID(jobid, params.connection);
            const successMsg = params.response.console.log("Submitted job successfully!", jobDetails.jobname, jobDetails.jobid);
            this.log.info(successMsg);
            params.response.data.setObj(jobDetails);
            params.response.format.output({
                output: jobDetails,
                format: "object",
                fields: ["jobid", "jobname", "owner", "status", "rc"]
            });
        }
    }
}

