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
    ],
    options: [{
        name: "prefix", aliases: ["p"],
        description: "Specify the job name prefix of the jobs you want to list. " +
        "The command does not prevalidate the owner. " +
        "You can specify a wildcard according to the z/OSMF Jobs REST endpoint documentation, " +
        "which is usually in the form \"JOB*\".\n When using FTP, prefix is required. You " +
        "cannot search by owner except by filtering yourself.",
        type: "string",
        required: true
    }],
    profile:
        {required: ["zftp"]},
    outputFormatOptions: true
};
