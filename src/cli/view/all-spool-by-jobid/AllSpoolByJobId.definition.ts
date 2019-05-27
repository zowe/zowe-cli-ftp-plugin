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

import { ICommandDefinition } from "@brightside/imperative";


export const ViewAllSpoolByJobidDefinition: ICommandDefinition = {
    handler: __dirname + "/AllSpoolByJobId.Handler",
    type: "command",
    name: "all-spool-by-jobid", aliases: ["asbj"],
    summary: "View all spool content for a job",
    description: "View all spool content for a job by providing the job id",
    examples: [
        {
            description: "View all spool content for the job with ID JOB00123 (optionally abbreviating the job ID)",
            options: "j123"
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
    options: [],
    profile:
        {optional: ["zftp"]},
};
