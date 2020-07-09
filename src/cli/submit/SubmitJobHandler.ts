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

import { JobUtils } from "../../api/JobUtils";
import { FTPBaseHandler } from "../../FTPBase.Handler";
import { IFTPHandlerParams } from "../../IFTPHandlerParams";

const ONE_SECOND = 1000;
const DEFAULT_INTERVAL = 3000;
const DEFAULT_MAX_TRIES = Infinity;
let interval = 0;
let maxTries = 0;
export abstract class SubmitJobHandler extends FTPBaseHandler {
    public async submitJCL(jcl: string, params: IFTPHandlerParams): Promise<void> {

        if (params.arguments.wait || params.arguments.wfo || params.arguments.wfa) {
            const input = RegExp(/^\d+,\d+$/);
            const matched = input.test(params.arguments.wait);
            if (matched === true) {
                const wait = params.arguments.wait.split(",", 2);
                interval = wait[0] * ONE_SECOND;
                maxTries = wait[1] * 1;
            } else if (params.arguments.wfo || params.arguments.wfa) {
                interval = DEFAULT_INTERVAL;
                maxTries = DEFAULT_MAX_TRIES;
            } else {
                const notmatchMsg = params.response.console.log("Syntax error: The format of wait option is comma-separated numeric values. " +
                    "For example,'5,12' means queries job status every 5 seconds for 12 times at most.");
                this.log.error(notmatchMsg);
                return Promise.resolve();
            }
            const jobid = await params.connection.submitJCL(jcl);
            const jobDetails = await JobUtils.findJobByID(jobid, params.connection);
            const subMsg = params.response.console.log("Submitted job successfully, jobname(jobid): %s(%s)", jobDetails.jobname, jobDetails.jobid);
            this.log.info(subMsg);
            const waitMsg = params.response.console.log("Waiting for job completion.");
            this.log.info(waitMsg);
            return new Promise((resolve, reject) => {
                let num = 0;
                let time = interval / ONE_SECOND;
                const timerId = setInterval(async () => {
                    try {
                        const jobDetails1 = await JobUtils.findJobByID(jobid, params.connection);
                        const status = jobDetails1.status.toString();
                        if (status === "OUTPUT") {
                            const successMsg = params.response.console.log("Job %s finished.", jobDetails1.jobid);
                            params.response.data.setObj(jobDetails1);
                            params.response.format.output({
                                output: jobDetails1,
                                format: "object",
                                fields: ["jobid", "jobname", "owner", "status", "rc"]
                            });
                            this.log.info(successMsg);
                            setTimeout(() => {
                                clearInterval(timerId);
                                resolve();
                            }, 0);
                        } else if (num === maxTries) {
                            const runningMsg = params.response.console.log("Job is still running.");
                            this.log.info(runningMsg);

                            params.response.data.setObj(jobDetails1);
                            params.response.format.output({
                                output: jobDetails1,
                                format: "object",
                                fields: ["jobid", "jobname", "owner", "status"]
                            });

                            const tipMsg = params.response.console.log("\nPlease using the following command to check its status later: \n" +
                                "    \"zowe zos-ftp view job-status-by-jobid", jobDetails1.jobid, "\"");
                            this.log.info(tipMsg);
                            setTimeout(() => {
                                clearInterval(timerId);
                                resolve();
                            }, 0);
                        } else if (status === "ACTIVE" && params.arguments.wfa) {
                            // const jobid2 = await params.connection.submitJCL(jcl);
                            const jobDetails2 = await JobUtils.findJobByID(jobid, params.connection);
                            const activeMsg = params.response.console.log("Job is active.");
                            this.log.info(activeMsg);
                            params.response.data.setObj(jobDetails2);
                            params.response.format.output({
                                output: jobDetails2,
                                format: "object",
                                fields: ["jobid", "jobname", "owner", "status"]
                            });
                            setTimeout(() => {
                                clearInterval(timerId);
                                resolve();
                            }, 0);
                        } else {
                            const waittimeMsg = params.response.console.log(time.toString(), "s");
                            this.log.info(waittimeMsg);
                            time = time + interval / ONE_SECOND;
                            num = num + 1;
                        }
                    } catch (err) {
                        const errMsg = params.response.console.log(err);
                        this.log.info(errMsg);
                        reject();
                    }
                }, interval);
            });
        } else {
            const jobid = await params.connection.submitJCL(jcl);
            const jobDetails = await JobUtils.findJobByID(jobid, params.connection);
            const message = params.response.console.log("Submitted job successfully, jobname(jobid): %s(%s)", jobDetails.jobname, jobDetails.jobid);
            this.log.info(message);
            params.response.data.setObj(jobDetails);
            params.response.format.output({
                output: jobDetails,
                format: "object",
                fields: ["jobid", "jobname", "owner", "status"]
            });
        }
    }
}
