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

import { ICommandArguments } from "@zowe/imperative";
import { FTPConfig } from "../../../src/api/FTPConfig";

describe("FTPConfig", () => {

    it("should return the correct non-secure config", () => {
        const args: Partial<ICommandArguments> = {
            host: "host1",
            user: "user1",
            password: "password1",
            port: 210,
            connectionTimeout: 600,
        };
        const config = FTPConfig.createConfigFromArguments(args);
        expect(config).toMatchSnapshot();
    });

    it("should return the correct secure config", () => {
        const args = {
            host: "host1",
            user: "user1",
            password: "password1",
            port: 210,
            connectionTimeout: 600,
            secureFtp: "true",
            rejectUnauthorized: false,
            serverName: "server1"
        };
        const config = FTPConfig.createConfigFromArguments(args);
        expect(config).toMatchSnapshot();
    });
});
