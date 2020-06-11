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
            let interval = 0;
            let maxtry = 0;
            const s = 1000;
            const defaultinterval = 5000;
            const defaultmaxtry = 12;
            const input = RegExp(/^\d+,\d+$/);
            const matched = input.test(params.arguments.wait);
            if (matched === true) {
                const wait = params.arguments.wait.split(",", 2);
                interval = wait[0] * s;
                maxtry = wait[1];
            } else {
                const notmatchMsg = params.response.console.log("The wait value is invalid. The default value 5,12 is used.");
                this.log.info(notmatchMsg);
                interval = defaultinterval;
                maxtry = defaultmaxtry;
            }
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
                            const stopcheckMsg = params.response.console.log("Job is runing, palease check status later!", +
                                jobDetails.jobname, jobDetails.jobid);
                            this.log.info(stopcheckMsg);
                            setTimeout(() => {
                                clearInterval(timerId);
                                resolve();
                            }, 0);
                        } else {
                            const waitMsg = params.response.console.log("Job is runing, palease wait!", jobDetails.jobname, jobDetails.jobid);
                            this.log.info(waitMsg);
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
