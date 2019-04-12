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


export const DownloadAllSpoolByJobidDefinition: ICommandDefinition = {
    handler: __dirname + "/AllSpoolByJobId.Handler",
    type: "command",
    name: "all-spool-by-jobid", aliases: ["asbj"],
    summary: "Download all spool content for a job",
    description: "Download all spool content for a job to files in a local directory by providing the job id",
    examples: [
        {
            description: "Download all spool for the job with the ID JOB00123 to the default subdirectory in the current directory",
            options: "j123"
        },
        {
            description: "Download all spool for the job with the ID JOB00123 to the directory build/job_output",
            options: "j123 -d build/job_output/"
        },
    ],
    positionals: [
        {
            name: "jobid",
            description: "The ID of the job " +
            "for which you would like to list spool files",
            type: "string",
            required: true
        }
    ],
    options: [
        {
            name: "directory", aliases: ["d"],
            description: "The local directory to save the spool content to. By default, it " +
            "will be saved to \"./output\".",
            type: "string"
        },
        {
            name: "omit-jobid-directory", aliases: ["ojd"],
            description: "If you specify this, the job output will be saved directly to " +
            "the specified (or default) directory. For example, if you omit this, the output " +
            "would be saved to ./output/JOB00123. If you specify --ojd, the JOB00123 directory would not" +
            " be included in the output path and the content would be saved to ./output.",
            type: "boolean"
        }
    ],
    profile:
        {required: ["zftp"]},
};
