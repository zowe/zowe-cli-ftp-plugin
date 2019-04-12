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

import { IImperativeConfig } from "@zowe/imperative";

const tlsConnectionOptionGroup: string = "TLS / Secure Connection options";
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
                        optionDefinition: {
                            type: "string",
                            name: "host", aliases: ["H"],
                            required: true,
                            description: "The hostname or IP address of the z/OS server to connect to."
                        }
                    },
                    port: {
                        type: "number",
                        optionDefinition: {
                            type: "number",
                            name: "port", aliases: ["P"],
                            required: true,
                            description: "The port of the z/OS FTP server.",
                            defaultValue: 21
                        }
                    },
                    user: {
                        type: "string",
                        optionDefinition: {
                            type: "string",
                            name: "user", aliases: ["u"],
                            required: true,
                            description: "Username for authentication on z/OS"
                        },
                        secure: true
                    },
                    password: {
                        type: "string",
                        optionDefinition: {
                            type: "string",
                            name: "password", aliases: ["p"],
                            required: true,
                            description: "Password to authenticate to FTP."
                        },
                        secure: true
                    },
                    secure: {
                        type: "string",
                        optionDefinition: {
                            name: "secure-ftp",
                            type: "string",
                            description: "Set to true for both control and data connection encryption," +
                            " 'control' for control connection encryption only, or 'implicit' for implicitly" +
                            " encrypted control connection (this mode is deprecated in modern times, but usually uses port 990). " +
                            "Note: Unfortunately, this plugin's functionality only works with FTP and FTPS, not 'SFTP' which is FTP over SSH."
                        }
                    },
                    secureOptions: {
                        type: "object",
                        properties: {
                            rejectUnauthorized: {
                                type: ["boolean", "null"],
                                optionDefinition: {
                                    name: "reject-unauthorized",
                                    aliases: ["ru"],
                                    description: "Reject self-signed certificates. Only specify this if " +
                                    "you are connecting to a secure FTP instance.",
                                    type: "boolean",
                                    defaultValue: null,
                                    group: tlsConnectionOptionGroup
                                },
                            },
                            servername: {
                                type: ["string", "null"],
                                optionDefinition: {
                                    name: "server-name",
                                    aliases: ["sn"],
                                    description: "Server name for the SNI (Server Name Indication) TLS extension. " +
                                    "Only specify if you are connecting securely",
                                    group: tlsConnectionOptionGroup,
                                    type: "string",
                                    defaultValue: null
                                }
                            }
                        }
                    },
                    connectionTimeout: {
                        type: "number",
                        optionDefinition: {
                            name: "connection-timeout", aliases: ["ct"],
                            description: "How long (in milliseconds) to wait for the control connection to be established.",
                            defaultValue: 10000,
                            type: "number"
                        }
                    },
                },
                required: ["host", "port", "user", "password"],
            },
        },
    ]
};

export = config;
