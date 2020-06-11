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


export const SubmitLocalFileDefinition: ICommandDefinition = {
    handler: __dirname + "/LocalFile.Handler",
    description: "Submit a job from a local file containing JCL",
    type: "command",
    name: "local-file", aliases: ["lf"],
    summary: "Submit a job from a local file containing JCL",
    examples: [
        {
            description: "Submit a job from the local file \"my_build_jcl.txt\"",
            options: "\"my_build_jcl.txt\""
        },
        {
            description: "Submit a job from the local file \"my_build_jcl.txt\" and print only the job ID",
            options: "\"my_build_jcl.txt\" --rff jobid --rft string"
        },
        {
            description: "Submit a job from the local file \"my_build_jcl.txt\" and waitting job status",
            options: "\"my_build_jcl.txt\" --wait 5,12"
        },
    ],
    positionals: [{
        name: "file",
        description: "The file you would like to submit as jcl",
        type: "existingLocalFile",
        required: true
    }],
    options: [
        {
            name: "wait",
            aliases: ["w"],
            description: "Using this option to specify job query interval and max times of querying job status." +
            "The default value is 5,12 which means query job status every 5 seconds and the Maximum query time is 12",
            type: "string",
            required: false
        }],
    profile:
        {optional: ["zftp"]},
    outputFormatOptions: true
};
