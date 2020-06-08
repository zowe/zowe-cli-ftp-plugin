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

export abstract class SubmitJobHandler extends FTPBaseHandler {
    public async submitJCL(jcl: string, params: IFTPHandlerParams): Promise<void> {
        const jobid = await params.connection.submitJCL(jcl);
        if (params.arguments.wait) {
            const wait = params.arguments.wait.split(",", 2);
            // tslint:disable-next-line: no-magic-numbers
            const interval = wait[0] * 1000;
            const maxtry = wait[1] * 1;
            return new Promise((resolve, reject) => {
                let num = 0;
                const timerId = setInterval(async () => {
                    try {
                        const jobDetails = await JobUtils.findJobByID(jobid, params.connection);
                        const status = jobDetails.status.toString();
                        if (status === "OUTPUT") {
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
                        } else if (num === maxtry) {
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
                            const successMsg5 = params.response.console.log(num.toString());
                            this.log.info(successMsg5);

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
            const jobDetails = await JobUtils.findJobByID(jobid, params.connection);
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
