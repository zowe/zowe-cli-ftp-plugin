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
import { JobUtils } from "../../api/JobUtils";
import { FTPBaseHandler } from "../../FTPBase.Handler";
import { IFTPHandlerParams } from "../../IFTPHandlerParams";

const ONE_SECOND = 1000;
const DEFAULT_INTERVAL = 5000;
const DEFAULT_MAX_TRIES = 12;
export abstract class SubmitJobHandler extends FTPBaseHandler {
    public async submitJCL(jcl: string, params: IFTPHandlerParams): Promise<void> {
        const jobid = await params.connection.submitJCL(jcl);
        if (params.arguments.wait) {
            let interval = 0;
            let maxTries = 0;
            const input = RegExp(/^\d+,\d+$/);
            const matched = input.test(params.arguments.wait);
            if (matched === true) {
                const wait = params.arguments.wait.split(",", 2);
                interval = wait[0] * ONE_SECOND;
                maxTries = wait[1] * 1;
            } else {
                const notmatchMsg = params.response.console.log("The wait value", "\"", params.arguments.wait, "\"", " is invalid. " +
                    "The default value \"5,12\" is used.");
                this.log.info(notmatchMsg);
                interval = DEFAULT_INTERVAL;
                maxTries = DEFAULT_MAX_TRIES;
            }
            return new Promise((resolve, reject) => {
                let num = 0;
                let time = interval / ONE_SECOND;
                let flag = "N";
                const timerId = setInterval(async () => {
                    try {
                        const jobDetails = await JobUtils.findJobByID(jobid, params.connection);
                        const status = jobDetails.status.toString();
                        if (status === "OUTPUT") {
                            const successMsg = params.response.console.log("Job finished, rc:", jobDetails.rc);
                            this.log.info(successMsg);
                            setTimeout(() => {
                                clearInterval(timerId);
                                resolve();
                            }, 0);
                        } else if (num === maxTries) {
                            const stopcheckMsg = params.response.console.log("Job is running. Please using the following command to check status later: \n" +
                                "\"zowe zos-ftp view job-status-by-jobid", jobDetails.jobid, "\"");
                            this.log.info(stopcheckMsg);
                            setTimeout(() => {
                                clearInterval(timerId);
                                resolve();
                            }, 0);
                        } else {
                            if (flag === "N") {
                                const waitMsg = params.response.console.log("Submitted job successfully. " +
                                    "jobname:", jobDetails.jobname, ", jobid:", jobDetails.jobid, "\nWaiting for job completion.");
                                this.log.info(waitMsg);
                                flag = "Y";
                            } else if (flag === "Y") {
                                const waittimeMsg = params.response.console.log(time.toString(), "s");
                                this.log.info(waittimeMsg);
                                time = time + interval / ONE_SECOND;
                                num = num + 1;
                            }
                        }
                    } catch (err) {
                        const errMsg = params.response.console.log(err);
                        this.log.info(errMsg);
                        reject();
                    }
                }, interval);
            });
        } else {
            const jobDetails = await JobUtils.findJobByID(jobid, params.connection);
            this.log.info("Submitted job successfully, jobname(jobid): %s(%s)", jobDetails.jobname, jobDetails.jobid);
            params.response.data.setObj(jobDetails);
            params.response.format.output({
                output: jobDetails,
                format: "object",
                fields: ["jobid", "jobname", "owner", "status"]
            });
        }
    }
}
