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

import { IImperativeConfig } from "@brightside/imperative";
import { FTPConfig } from "./api/FTPConfig";

const config: IImperativeConfig = {
    commandModuleGlobs: ["**/cli/*/*.definition!(.d).*s"],
    rootCommandDescription: "Data set and job functionality via FTP. This functionality " +
    "uses the open source zos-node-accessor package from IBM. Commands under this group " +
    "require you to create a zftp profile before using them.\n" +
    "If you find this functionality useful, please consider setting up z/OSMF on " +
    "your system to get improved stability and speed and more features (for example, issuing TSO and console commands) by using " +
    "core Zowe CLI.",
    productDisplayName: "z/OS FTP Plugin",
    pluginAliases: ["zftp"],
    pluginSummary: "z/OS Files and jobs via FTP",
    pluginHealthCheck: "./lib/healthCheck.handler",
    name: "zos-ftp",
    profiles: [
        {
            type: "zftp",
            createProfileExamples: [{
                options: "myprofile -u ibmuser -p ibmp4ss -H sys123",
                description: "Create a zftp profile called 'myprofile' with default settings (port" +
                ", timeout, etc.) to connect with the host system 123."
            }],
            schema: {
                type: "object",
                title: "Configuration profile for z/OS FTP",
                description: "Configuration profile for z/OS FTP",
                properties: {
                    host: {
                        type: "string",
                        optionDefinition: FTPConfig.OPTION_HOST
                    },
                    port: {
                        type: "number",
                        optionDefinition: FTPConfig.OPTION_PORT
                    },
                    user: {
                        type: "string",
                        optionDefinition: FTPConfig.OPTION_USER,
                        secure: true
                    },
                    password: {
                        type: "string",
                        optionDefinition: FTPConfig.OPTION_PASSWORD,
                        secure: true
                    },
                    secureFtp: {
                        type: ["boolean", "null"],
                        optionDefinition: FTPConfig.OPTION_SECURE_FTP
                    },
                    rejectUnauthorized: {
                        type: ["boolean", "null"],
                        optionDefinition: FTPConfig.OPTION_REJECT_UNAUTHORIZED
                    },
                    servername: {
                        type: ["string", "null"],
                        optionDefinition: FTPConfig.OPTION_SERVER_NAME
                    },
                    connectionTimeout: {
                        type: "number",
                        optionDefinition: FTPConfig.OPTION_CONNECTION_TIMEOUT
                    },
                },
                optional: ["host", "port", "user", "password"],
            },
        },
    ]
};

export = config;
