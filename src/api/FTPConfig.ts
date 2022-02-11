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

import { isString } from "util";
import { IZosFTPProfile } from "./doc/IZosFTPProfile";
import { ICommandOptionDefinition } from "@zowe/imperative";

const tlsConnectionOptionGroup: string = "TLS / Secure Connection options";

export class FTPConfig {

    public static OPTION_HOST: ICommandOptionDefinition = {
        type: "string",
        name: "host", aliases: ["H"],
        description: "The hostname or IP address of the z/OS server to connect to."
    };

    public static OPTION_PORT: ICommandOptionDefinition = {
        type: "number",
        name: "port", aliases: ["P"],
        description: "The port of the z/OS FTP server.",
        defaultValue: 21
    };

    public static OPTION_USER: ICommandOptionDefinition = {
        type: "string",
        name: "user", aliases: ["u"],
        description: "Username for authentication on z/OS"
    };

    public static OPTION_PASSWORD: ICommandOptionDefinition = {
        type: "string",
        name: "password", aliases: ["p", "pass", "pw"],
        description: "Password to authenticate to FTP."
    };

    public static OPTION_SECURE_FTP: ICommandOptionDefinition = {
        name: "secure-ftp",
        type: "boolean",
        defaultValue: true,
        description: "Set to true for both control and data connection encryption," +
            " 'control' for control connection encryption only, or 'implicit' for implicitly" +
            " encrypted control connection (this mode is deprecated in modern times, but usually uses port 990). " +
            "Note: Unfortunately, this plugin's functionality only works with FTP and FTPS, not 'SFTP' which is FTP over SSH."
    };

    public static OPTION_REJECT_UNAUTHORIZED: ICommandOptionDefinition = {
        name: "reject-unauthorized",
        aliases: ["ru"],
        description: "Reject self-signed certificates. Only specify this if " +
            "you are connecting to a secure FTP instance.",
        type: "boolean",
        defaultValue: null,
        group: tlsConnectionOptionGroup
    };

    public static OPTION_SERVER_NAME: ICommandOptionDefinition = {
        name: "server-name",
        aliases: ["sn"],
        description: "Server name for the SNI (Server Name Indication) TLS extension. " +
            "Only specify if you are connecting securely",
        group: tlsConnectionOptionGroup,
        type: "string",
        defaultValue: null
    };

    public static OPTION_CONNECTION_TIMEOUT: ICommandOptionDefinition = {
        name: "connection-timeout", aliases: ["ct"],
        description: "How long (in milliseconds) to wait for the control connection to be established.",
        defaultValue: 10000,
        type: "number"
    };

    /**
     * Shared options used by all FTP commands
     */
    public static FTP_CONNECTION_OPTIONS: ICommandOptionDefinition[] = [
        FTPConfig.OPTION_HOST,
        FTPConfig.OPTION_PORT,
        FTPConfig.OPTION_USER,
        FTPConfig.OPTION_PASSWORD,
        FTPConfig.OPTION_SECURE_FTP,
        FTPConfig.OPTION_REJECT_UNAUTHORIZED,
        FTPConfig.OPTION_SERVER_NAME,
        FTPConfig.OPTION_CONNECTION_TIMEOUT
    ];

    /**
     * Convert a profile into a config object used to connect to
     * zos-node-accessor
     * @param arguments - the arguments passed by the user
     * @returns  the connection to zos-node-accessor's APIs
     */
    public static async connectFromArguments(args: any) {
        const ftpConfig = FTPConfig.createConfigFromArguments(args);
        const zosAccessor = new (require("zos-node-accessor"))();
        return zosAccessor.connect(ftpConfig);
    }

    /**
     * Convert a profile into a config object used to connect to
     * zos-node-accessor
     * @param arguments - the profile created by the user
     * @returns the config object for zos-node-accessor's ftp connection
     */
    public static createConfigFromArguments(args: any): any {
        // build the options argument for zos-node-accessor
        const result: any = {
            host: args.host,
            user: args.user,
            password: args.password,
            port: args.port,
            connTimeout: args.connectionTimeout
        };
        if (args.secureFtp != null) {
            if (isString(args.secureFtp) && args.secureFtp.trim().toLowerCase() === "true") {
                result.secure = true;
            } else {
                result.secure = args.secureFtp;
            }
        }
        if (this.profileHasSecureOptions(args)) {
            result.secureOptions = {
                rejectUnauthorized: args.rejectUnauthorized,
                serverName: args.serverName,
            };
        }
        return result;
    }

    /**
     * Determine whether the user specified any TLS connection options
     * @param args - the profile loaded from the user
     * @returns true if the user has specified any secure connection options
     */
    private static profileHasSecureOptions(args: IZosFTPProfile): boolean {
        return (args.rejectUnauthorized != null) || (args.serverName !== null);
    }
}
