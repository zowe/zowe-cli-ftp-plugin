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

import { ImperativeError } from "@zowe/imperative";
import { FileType } from "zos-node-accessor/lib/interfaces/USSEntry";
import { UssUtils } from "../../../src/api/UssUtils";

function fileEntry(name: string) {
    return { name, fileType: FileType.FILE };
}

function dirEntry(name: string) {
    return { name, fileType: FileType.DIRECTORY };
}

describe("UssUtils", () => {

    it("should return the normalized path as is", () => {
        let path = UssUtils.normalizeUnixPath("C:\\Users\\hello.text");
        expect(path).toBe("C:\\Users\\hello.text");

        path = UssUtils.normalizeUnixPath("/home/user1/hello.text");
        expect(path).toBe("/home/user1/hello.text");
    });

    it("should normanlize path correctly", () => {
        let path = UssUtils.normalizeUnixPath("C:/Users/hello.text");
        expect(path).toBe("/c/Users/hello.text");

        path = UssUtils.normalizeUnixPath("//home/user1/hello.text");
        expect(path).toBe("/home/user1/hello.text");
    });

    it("should throw error when the uss file path is not absolute file Path", () => {
        const path = "test.txt";
        const result = () => {
            UssUtils.checkAbsoluteFilePath(path);
        };
        expect(result).toThrow(ImperativeError);
    });

    describe("deleteDirectory", () => {
        let connection: any;
        let response: any;

        beforeEach(() => {
            connection = {
                listFiles: jest.fn(),
                deleteFile: jest.fn().mockResolvedValue(undefined),
            };
            response = { log: jest.fn() };
        });

        // ── Regression ──────────────────────────────────────────────────────

        it("deletes an empty directory", async () => {
            connection.listFiles.mockResolvedValue([]);

            await UssUtils.deleteDirectory(connection, "/u/user/dir");

            expect(connection.listFiles).toHaveBeenCalledWith("/u/user/dir");
            expect(connection.deleteFile).toHaveBeenCalledTimes(1);
            expect(connection.deleteFile).toHaveBeenCalledWith("/u/user/dir");
        });

        it("deletes every file in a flat directory and logs each deletion", async () => {
            connection.listFiles.mockResolvedValue([
                fileEntry("a.txt"),
                fileEntry("b.txt"),
            ]);

            await UssUtils.deleteDirectory(connection, "/u/user/dir", response);

            expect(connection.listFiles).toHaveBeenCalledTimes(1);
            expect(connection.deleteFile).toHaveBeenCalledWith("/u/user/dir/a.txt");
            expect(connection.deleteFile).toHaveBeenCalledWith("/u/user/dir/b.txt");
            expect(connection.deleteFile).toHaveBeenCalledWith("/u/user/dir");
            expect(connection.deleteFile).toHaveBeenCalledTimes(3);
            expect(response.log).toHaveBeenCalledTimes(3);
        });

        it("recurses into subdirectories and deletes children before parents", async () => {
            connection.listFiles
                .mockResolvedValueOnce([dirEntry("sub"), fileEntry("root.txt")])
                .mockResolvedValueOnce([fileEntry("child.txt")]);

            await UssUtils.deleteDirectory(connection, "/u/user/dir", response);

            expect(connection.listFiles).toHaveBeenCalledTimes(2);
            const order: string[] = connection.deleteFile.mock.calls.map((c: any[]) => c[0]);
            expect(order.indexOf("/u/user/dir/sub/child.txt")).toBeLessThan(order.indexOf("/u/user/dir/sub"));
            expect(order.indexOf("/u/user/dir/sub")).toBeLessThan(order.indexOf("/u/user/dir"));
        });

        it("completes without error when no response object is provided", async () => {
            connection.listFiles.mockResolvedValue([fileEntry("x.txt")]);

            await expect(
                UssUtils.deleteDirectory(connection, "/u/user/dir")
            ).resolves.toBeUndefined();

            expect(connection.deleteFile).toHaveBeenCalledTimes(2);
        });

        // ── Dot / dot-dot filtering ──────────────────────────────────────────

        it("skips '.' entries so the same directory is not re-listed", async () => {
            connection.listFiles.mockResolvedValue([
                dirEntry("."),
                fileEntry("real.txt"),
            ]);

            await UssUtils.deleteDirectory(connection, "/u/user/dir", response);

            expect(connection.listFiles).toHaveBeenCalledTimes(1);
            expect(connection.deleteFile).not.toHaveBeenCalledWith("/u/user/dir/.");
            expect(connection.deleteFile).toHaveBeenCalledWith("/u/user/dir/real.txt");
        });

        it("skips '..' entries", async () => {
            connection.listFiles.mockResolvedValue([
                dirEntry(".."),
                fileEntry("real.txt"),
            ]);

            await UssUtils.deleteDirectory(connection, "/u/user/dir", response);

            expect(connection.listFiles).toHaveBeenCalledTimes(1);
            expect(connection.deleteFile).not.toHaveBeenCalledWith("/u/user/dir/..");
            expect(connection.deleteFile).toHaveBeenCalledWith("/u/user/dir/real.txt");
        });

        it("skips both '.' and '..' — only the directory itself is deleted", async () => {
            connection.listFiles.mockResolvedValue([dirEntry("."), dirEntry("..")]);

            await UssUtils.deleteDirectory(connection, "/u/user/dir");

            expect(connection.listFiles).toHaveBeenCalledTimes(1);
            expect(connection.deleteFile).toHaveBeenCalledTimes(1);
            expect(connection.deleteFile).toHaveBeenCalledWith("/u/user/dir");
        });

        it("resolves without recursing when the only entry is '.'", async () => {
            connection.listFiles.mockResolvedValue([dirEntry(".")]);

            await expect(
                UssUtils.deleteDirectory(connection, "/u/user/dir")
            ).resolves.toBeUndefined();

            expect(connection.listFiles).toHaveBeenCalledTimes(1);
        });

        // ── Depth guard ──────────────────────────────────────────────────────

        it("throws ImperativeError before listing when depth already exceeds MAX_DELETE_DEPTH", async () => {
            const maxDepth = (UssUtils as any).MAX_DELETE_DEPTH as number;

            await expect(
                UssUtils.deleteDirectory(connection, "/u/user/dir", undefined, maxDepth + 1)
            ).rejects.toThrow(ImperativeError);

            expect(connection.listFiles).not.toHaveBeenCalled();
        });

        it("error message contains the offending path and the depth limit", async () => {
            const maxDepth = (UssUtils as any).MAX_DELETE_DEPTH as number;
            const offendingPath = "/u/user/very/deep/dir";

            await expect(
                UssUtils.deleteDirectory(connection, offendingPath, undefined, maxDepth + 1)
            ).rejects.toThrow(offendingPath);

            await expect(
                UssUtils.deleteDirectory(connection, offendingPath, undefined, maxDepth + 1)
            ).rejects.toThrow(String(maxDepth));
        });

        it("succeeds at exactly MAX_DELETE_DEPTH (boundary)", async () => {
            const maxDepth = (UssUtils as any).MAX_DELETE_DEPTH as number;
            connection.listFiles.mockResolvedValue([]);

            await expect(
                UssUtils.deleteDirectory(connection, "/u/user/dir", undefined, maxDepth)
            ).resolves.toBeUndefined();
        });

        it("throws ImperativeError when a server synthesises an unbounded directory tree", async () => {
            const maxDepth = (UssUtils as any).MAX_DELETE_DEPTH as number;
            let listCount = 0;
            connection.listFiles.mockImplementation(() => {
                listCount++;
                return Promise.resolve([dirEntry(`level${listCount}`)]);
            });

            await expect(
                UssUtils.deleteDirectory(connection, "/u/user/dir")
            ).rejects.toThrow(ImperativeError);

            // listFiles is called once per depth level from 0 to MAX_DELETE_DEPTH
            // then the guard fires at depth MAX_DELETE_DEPTH+1 before the next list
            expect(listCount).toBe(maxDepth + 1);
        });
    });
});
