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

export class FTPConfig {

    /**
     * Convert a profile into a config object used to connect to
     * zos-node-accessor
     * @param profile - the profile created by the user
     * @returns  the connection to zos-node-accessor's APIs
     */
    public static async connectFromProfile(profile: any) {
        const ftpConfig = FTPConfig.createConfigFromProfile(profile);
        const zosAccessor = new (require("zos-node-accessor"))();
        return zosAccessor.connect(ftpConfig);
    }

    /**
     * Convert a profile into a config object used to connect to
     * zos-node-accessor
     * @param profile - the profile created by the user
     * @returns the config object for zos-node-accessor's ftp connection
     */
    public static createConfigFromProfile(profile: IZosFTPProfile): any {
        // build the options argument for zos-node-accessor
        const result: any = {
            host: profile.host,
            user: profile.user,
            password: profile.password,
            port: profile.port,
            connTimeout: profile.connectionTimeout
        };
        if (profile.secure != null) {
            if (isString(profile.secure) && profile.secure.trim().toLowerCase() === "true") {
                result.secure = true;
            } else {
                result.secure = profile.secure;
            }
        }
        if (this.profileHasSecureOptions(profile)) {
            result.secureOptions = profile.secureOptions;
        }
        return result;
    }

    /**
     * Determine whether the user specified any TLS connection options
     * @param profile - the profile loaded from the user
     * @returns true if the user has specified any secure connection options
     */
    private static profileHasSecureOptions(profile: IZosFTPProfile): boolean {
        return profile.secureOptions != null &&
            ((profile.secureOptions.rejectUnauthorized != null) || (profile.secureOptions.ca != null));
    }
}
