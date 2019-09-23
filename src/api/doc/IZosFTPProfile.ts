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

import { IProfile } from "@brightside/imperative";

/**
 * Typescript representation of a loaded zos-ftp profile
 */
export interface IZosFTPProfile extends IProfile {
    user: string;
    password: string;
    host: string;
    port: number;
    /**
     *  Set to true for both control and data connection encryption,
     *  'control' for control connection encryption only, or 'implicit' for
     *  implicitly encrypted control connection (this mode is deprecated in modern times,
     *  but usually uses port 990)
     */
    secureFtp?: string;
    /**
     * TLS connection options that can be specified by the user in their profile
     */
    rejectUnauthorized?: boolean,
    /**
     * certificate authority for your secure connection
     */
    serverName?: string;

    jobCardFile?: string;
}
