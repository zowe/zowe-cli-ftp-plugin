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

import { Logger } from "@zowe/imperative";

export class UssUtils {

    /**
     * Try to make sure a unix path conforms to what ftp expects
     * Includes fixing paths that are messed up by git for windows tools
     * like turning paths /u/users into U:/Users
     * @param path - the path to normalize
     * @returns the normalized path
     */
    public static normalizeUnixPath(path: string) {
        this.log.debug("Normalizing unix path %s", path);
        // let's fix windows-ported unix tools trying to be helpful by converting paths to
        // windows style paths
        path = path.trim();
        const windowsStylePathPattern = /^([A-Z]+):\//i;
        const doubleSlashPattern = /^\/\//g;
        if (windowsStylePathPattern.test(path)) {
            const normalizedPath = path.replace(windowsStylePathPattern,
                (overallMatch: string, driveLetter: string) => {
                    return "/" + driveLetter.toLowerCase() + "/";
                });
            this.log.debug("Path has been normalized to %s", normalizedPath);
            return normalizedPath;
        } else if (doubleSlashPattern.test(path)) {
            // if the path starts with two slashes to avoid the 'correction'
            // then we will remove one of the slashes
            const normalizedPath = path.replace(doubleSlashPattern, "/");
            this.log.debug("Users specified two slashes at the beginning of the path, " +
                "possibly to avoid MSYS path correction. Replacing two slashes with one. Result: %s", normalizedPath);
            return normalizedPath;
        } else {
            this.log.debug("Path was already normalized. Using the path as-is.");
            return path;
        }
    }

    private static get log(): Logger {
        return Logger.getAppLogger();
    }
}
