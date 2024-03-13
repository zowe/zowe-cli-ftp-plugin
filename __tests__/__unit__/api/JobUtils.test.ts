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

import { IO } from "@zowe/imperative";
import { JobUtils } from "../../../src/api/JobUtils";
import { join } from "path";

describe("JobUtils", () => {
    const jobId = "test-job-id";
    const ddName = "test-dd-name";
    const procStep = "test-proc-step";
    const stepName = "test-step-name";

    describe("getSpoolDownloadFilePath", () => {
        it("should return a simple path", () => {
            const res = JobUtils.getSpoolDownloadFilePath({ jobId, ddName  });
            expect(res).toEqual("./" + join("output", jobId, ddName + ".txt"));
        });
        it("should return a fully qualified path", () => {
            const res = JobUtils.getSpoolDownloadFilePath({ jobId, ddName,
                extension: ".omg",
                outDir: "myDir",
                procStep, stepName,
            });
            expect(res).toEqual(join("myDir", jobId, procStep, stepName, ddName + ".omg"));
        });
    });

    describe("downloadSpoolContent", () => {
        const spyIoCreateDir = jest.fn();
        const spyIoWriteFile = jest.fn();
        beforeEach(() => {
            jest.resetAllMocks();
            jest.spyOn(IO, "createDirsSyncFromFilePath").mockImplementation(spyIoCreateDir);
            jest.spyOn(IO, "writeFile").mockImplementation(spyIoWriteFile);
        });

        it("should throw if trying to download in binary format", async () => {
            let caughtError: any;
            try {
                await JobUtils.downloadSpoolContent(null as any, {binary: true} as any);
            } catch(err) {
                caughtError = err;
            }
            expect(spyIoCreateDir).not.toHaveBeenCalled();
            expect(spyIoWriteFile).not.toHaveBeenCalled();
            expect(caughtError).toBeDefined();
            expect(caughtError.message).toContain("binary format");
        });
        it("should throw if there are no spool files to download", async () => {
            jest.spyOn(JobUtils, "findJobByID").mockResolvedValue({spoolFiles: []} as any);

            let caughtError: any;
            try {
                await JobUtils.downloadSpoolContent(null as any, {} as any);
            } catch(err) {
                caughtError = err;
            }
            expect(spyIoCreateDir).not.toHaveBeenCalled();
            expect(spyIoWriteFile).not.toHaveBeenCalled();
            expect(caughtError).toBeDefined();
            expect(caughtError.message).toContain("No spool files");
        });
        it("should attempt to write the downloaded contents", async () => {
            const testDir = "test-dir";
            const contents = "test-contents";
            jest.spyOn(JobUtils, "findJobByID").mockResolvedValue({spoolFiles: ["dummy"]} as any);
            jest.spyOn(JobUtils, "getSpoolFiles").mockResolvedValue([{contents}] as any);
            jest.spyOn(JobUtils, "getSpoolDownloadFilePath").mockReturnValue(testDir);

            let caughtError: any;
            try {
                await JobUtils.downloadSpoolContent(null as any, {} as any);
            } catch(err) {
                caughtError = err;
            }
            expect(caughtError).toBeUndefined();
            expect(spyIoCreateDir).toHaveBeenCalledWith(testDir);
            expect(spyIoWriteFile).toHaveBeenCalledWith(testDir, contents);
        });
    });
});
