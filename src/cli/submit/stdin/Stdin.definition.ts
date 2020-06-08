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
        {
            description: "Submit a job from the local file \"my_build_jcl.txt\" and waitting job status",
            options: "\"my_build_jcl.txt\" --wait 5,12"
        },
    ],
    options: [
        {
            name: "wait",
            aliases: ["w"],
            description: "Specify this option to waiting job finished results.",
            type: "boolean",
            required: false,
            defaultValue: "5,12"
        }],
    profile:
        {optional: ["zftp"]},
    outputFormatOptions: true
};
