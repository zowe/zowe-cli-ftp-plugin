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


export const ListJobsDefinition: ICommandDefinition = {
    handler: __dirname + "/Jobs.Handler",
    type: "command",
    name: "jobs", aliases: ["j"],
    summary: "List jobs by prefix",
    description: "List all data sets that match a DSLEVEL pattern (see help below). ",
    examples: [
        {
            description: "List all jobs with names beginning beginning with \"ibmu\"",
            options: "--prefix \"ibmu*\""
        },
        {
            description: "List Alice's jobs with names beginning beginning with \"ibmu\"",
            options: "--prefix \"ibmu*\" --owner \"alice\""
        },
    ],
    options: [{
        name: "prefix", aliases: [],
        description: "Specify the job name prefix of the jobs you own and want to list. " +
        "You can specify a wildcard, which is usually in the form \"JOB*\". \n ",
        type: "string",
        required: true
    }, {
        name: "owner", aliases: ["o"],
        description: "Specify the owner user ID of the jobs you want to list. The owner " +
        "is the individual/user who submitted the job OR the user ID assigned to the job. \n ",
        type: "string",
        required: false
    }],
    profile:
        {optional: ["zftp"]},
    outputFormatOptions: true
};
