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

import { ICommandDefinition } from "@zowe/imperative";


export const SubmitDataSetDefinition: ICommandDefinition = {
    handler: __dirname + "/DataSet.Handler",
    description: "Submit a job from a cataloged data set containing JCL. The JCL will be downloaded via FTP and then submitted.",
    type: "command",
    name: "data-set", aliases: ["ds"],
    summary: "Submit a job from a data set containing JCL",
    examples: [
        {
            description: "Submit a job residing in the data set \"ibmuser.cntl(iefbr14)\"",
            options: "\"ibmuser.cntl(iefbr14)\""
        },
        {
            description: "Submit a job from the data set \"ibmuser.cntl(iefbr14)\" and print only the job ID",
            options: "\"ibmuser.cntl(iefbr14)\" --rff jobid --rft string"
        },
        {
            description: "Submit a job from the data set \"ibmuser.cntl(iefbr14)\" and waitting job status",
            options: "\"ibmuser.cntl(iefbr14)\" --wait 5,12"
        },
    ],
    positionals: [{
        name: "dataSet",
        description: "The data set containing JCL that you would like to submit",
        type: "string",
        required: true
    }],
    options: [
        {
            name: "wait",
            aliases: ["w"],
            description: "Using this option to specify job query interval and max times of querying job status",
            type: "string",
            required: false,
            defaultValue: "5,12"
        }],
    profile:
        {optional: ["zftp"]},
    outputFormatOptions: true
};
