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
import { DataSetUtils } from "../../../src/api";

describe("DataSetUtils", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    describe("listDataSets", () => {
        it("should return a list of datasets", async () => {
            const expected = [{name: "0"}, {name: "1"}];
            const connection = {
                listDataset: jest.fn().mockResolvedValue(expected),
            };

            const response = await DataSetUtils.listDataSets(connection, "dsname");

            expect(connection.listDataset).toHaveBeenCalledWith("dsname");
            expect(response).toEqual(expected);
        });
    });

    describe("listMembers", () => {
        it("should return a list of members", async () => {
            const expected = [{name: "0"}, {name: "1"}];
            const connection = {
                listDataset: jest.fn().mockResolvedValue(expected),
            };

            const response = await DataSetUtils.listMembers(connection, "dsname");

            expect(connection.listDataset).toHaveBeenCalledWith("dsname(*)");
            expect(response).toEqual(expected);
        });
    });

    describe("deleteDataSet", () => {
        it("should delete a dataset", async () => {
            const connection = { deleteDataset: jest.fn() };

            await DataSetUtils.deleteDataSet(connection, "dsname");

            expect(connection.deleteDataset).toHaveBeenCalledWith("'dsname'");
        });
    });

    describe("renameDataSet", () => {
        it("should rename a dataset", async () => {
            const connection = { rename: jest.fn() };

            await DataSetUtils.renameDataSet(connection, "old", "new");

            expect(connection.rename).toHaveBeenCalledWith("old", "new");
        });
    });

    describe("allocateDataSet", () => {
        it("should allocate a dataset", async () => {
            const connection = { allocateDataset: jest.fn() };

            await DataSetUtils.allocateDataSet(connection, "dsname", {dcb: "dcb"});

            expect(connection.allocateDataset).toHaveBeenCalledWith("dsname", "dcb");
        });
    });

    describe("allocateLikeDataSet", () => {
        it("should allocate a dataset using attributes from another dataset", async () => {
            const options = { dsorg: "po", recfm: "FB", lrecl: "80" };
            const connection = {
                listDataset: jest.fn().mockResolvedValueOnce(undefined).mockResolvedValue([{...options, dsname: "likeDS"}, {dsname: "other"}]),
                allocateDataset: jest.fn(),
            };

            const response = await DataSetUtils.allocateLikeDataSet(connection, "newDS", "likeDS", {});
            expect(connection.listDataset).toHaveBeenCalledWith("newDS");
            expect(connection.listDataset).toHaveBeenCalledWith("likeDS");
            expect(connection.allocateDataset).toHaveBeenCalledWith("newDS", options);
            expect(response).toEqual(options);
        });

        it("should return the dataset attributes of the new dataset if it already exists", async () => {
            const options = { dsorg: "po", recfm: "FB", lrecl: "80" };
            const connection = {
                listDataset: jest.fn().mockResolvedValue([{...options, dsname: "likeDS"}, {dsname: "newDs"}]),
                allocateDataset: jest.fn(),
            };

            const response = await DataSetUtils.allocateLikeDataSet(connection, "newDS", "likeDS");
            expect(connection.listDataset).toHaveBeenCalledWith("newDS");
            expect(response).toEqual({});
        });

        it("should throw an error if the LIKE dataset does not exist", async () => {
            const connection = {
                listDataset: jest.fn().mockResolvedValueOnce(undefined).mockResolvedValue([{dsname: "another.dataset"}]),
            };

            let caughtError: ImperativeError;
            try {
                await DataSetUtils.allocateLikeDataSet(connection, "newDS", "likeDS");
                throw "FAILURE";
            } catch(err) {
                caughtError = err;
            }

            expect(caughtError).toBeInstanceOf(ImperativeError);
            expect(caughtError.message).toContain("No datasets found");
        });
    });

    describe("copyDataSet", () => {
        it("should copy a dataset while updating the progress bar", async () => {
            const connection = {
                listDataset: jest.fn().mockResolvedValueOnce(undefined).mockResolvedValue([{dsname: "from"}]),
                getDataset: jest.fn().mockResolvedValue("source.content"),
                uploadDataset: jest.fn(),
            };
            jest.spyOn(DataSetUtils, "allocateLikeDataSet").mockResolvedValue({dsorg: "po"});

            const progress = { start: jest.fn(), worked: jest.fn(), end: jest.fn() };
            await DataSetUtils.copyDataSet(connection, { fromDsn: "from", toDsn: "to", progress });

            expect(connection.listDataset).toHaveBeenCalledWith("to");
            expect(connection.listDataset).toHaveBeenCalledWith("from");
            expect(connection.getDataset).toHaveBeenCalledWith("'from'", "binary", false);
            expect(connection.uploadDataset).toHaveBeenCalledWith("source.content", "'to'", "binary", {dsorg: "po"});

            //Progress bar info
            expect(progress.start).toHaveBeenCalledWith(8, expect.any(String));
            expect(progress.worked).toHaveBeenCalledTimes(8);
            expect(progress.worked).toHaveBeenCalledWith(1, expect.any(String));
            expect(progress.worked).toHaveBeenCalledWith(8, expect.any(String));
            expect(progress.end).toHaveBeenCalled();
        });
    });
});
