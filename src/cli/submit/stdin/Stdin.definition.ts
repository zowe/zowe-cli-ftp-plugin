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


export const SubmitStdinDefinition: ICommandDefinition = {
    handler: __dirname + "/Stdin.Handler",
    description: "Submit a job from JCL written to the standard input (stdin) of this process.",
    type: "command",
    name: "stdin", aliases: ["si"],
    summary: "Submit a job from stdin",
    examples: [
        {
            description: "Submit a job from stdin, redirecting the contents of my_jcl.txt in.",
            options: " < my_jcl.txt"
        },
    ],
    profile:
        {required: ["zftp"]},
    outputFormatOptions: true
};
