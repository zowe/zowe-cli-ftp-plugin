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


export const DeleteJobDefinition: ICommandDefinition = {
    handler: __dirname + "/Job.Handler",
    description: "Cancel a job and purge its output. Note: this command will not work to delete " +
    "TSU or STC type jobs.",
    type: "command",
    name: "job", aliases: ["j"],
    summary: "Cancel a job and purge its output",
    examples: [
        {
            description: "Cancel the job \"JOB00123\" and purge its output, optionally abbreviating the job ID",
            options: "j123"
        }
    ],
    positionals: [
        {
            name: "jobid",
            description: "The ID of the job that you would like to delete",
            type: "string",
            required: true
        }
    ],
    options: [],
    profile:
        {optional: ["zftp"]},
};
