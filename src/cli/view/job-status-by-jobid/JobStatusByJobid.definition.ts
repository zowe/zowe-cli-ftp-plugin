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


export const ViewJobStatusByJobidDefinition: ICommandDefinition = {
    handler: __dirname + "/JobStatusByJobId.Handler",
    type: "command",
    name: "job-status-by-jobid", aliases: ["jsbj"],
    summary: "View status details of a z/OS job",
    description: "View status details of a single z/OS job on spool/JES queues. " +
    "The command does not prevalidate the JOBID.",
    examples: [
        {
            description: "View the status for the job with ID \"JOB00123\" (optionally abbreviating the ID)",
            options: "j123"
        },
    ],
    positionals: [
        {
            name: "jobId",
            description: "The ID of the job" +
            "for which you would like to list spool files",
            type: "string",
            required: true
        }
    ],
    options: [],
    profile:
        {optional: ["zftp"]},
    outputFormatOptions: true
};
