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

import { ITestEnvironment, TestEnvironment, runCliScript } from "@zowe/cli-test-utils";
import { ITestPropertiesSchema } from "../../../../__src__/doc/ITestPropertiesSchema";
import * as path from "path";

let testEnvironment: ITestEnvironment<ITestPropertiesSchema>;

describe("download all-spool-by-jobid command", () => {
    // Create the unique test environment
    beforeAll(async () => {
        testEnvironment = await TestEnvironment.setUp({
            testName: "zos_ftp_download_asbj",
            skipProperties: true,
            installPlugin: true
        });
        expect(testEnvironment).toBeDefined();
    });

    afterAll(async () => {
        await TestEnvironment.cleanUp(testEnvironment);
    });

    it("should display download all-spool-by-jobid help", () => {
        const shellScript = path.join(__dirname, "__scripts__", "download_all_spool_by_jobid_help.sh");
        const response = runCliScript(shellScript, testEnvironment);
        expect(response.stderr.toString()).toBe("");
        expect(response.status).toBe(0);
        expect(response.stdout.toString()).toMatchSnapshot();
    });
});
