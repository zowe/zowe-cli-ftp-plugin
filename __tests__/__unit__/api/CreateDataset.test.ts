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

import { ImperativeError, IO } from "@zowe/imperative";
import { CreateDataSetTypeEnum } from "@zowe/zos-files-for-zowe-sdk";
import { CreateDataset } from "../../../src/api/CreateDataset";
import { JobUtils } from "../../../src/api/JobUtils";

describe("CreateDataset", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should fail if requested to create a dataset of an unsuported type", async () => {
        const connection = {};
        let caughtError: ImperativeError;
        try {
            await CreateDataset.create(connection, -1, "dsname", "jobCard", {});
            throw "FAILURE";
        } catch(err) {
            caughtError = err;
        }
        expect(caughtError).toBeInstanceOf(ImperativeError);
        expect(caughtError.message).toEqual("Unsupported data set type.");
    });

    it("should return succes:false if we failed to create the dataset", async () => {
        const connection = { submitJCL: jest.fn() };
        jest.spyOn(IO, "readFileSync").mockReturnValue(Buffer.from("//JOBCARD"));
        jest.spyOn(JobUtils, "findJobByID").mockResolvedValue("SOME ERROR" as any);

        // Dummy options to touch all `else` branches
        const options: any = { printAttributes: false, size: "1", volser: "dummy", unit: "dummy" };
        const response = await CreateDataset.create(connection, 0, "dsname", "jobCard", options);

        expect(connection.submitJCL.mock.calls[0][0]).toMatchSnapshot();
        expect(response.commandResponse).toContain("Failed to create data set");
    });

    it("should return succes:false if we failed to create the dataset", async () => {
        const connection = { submitJCL: jest.fn() };
        jest.spyOn(IO, "readFileSync").mockReturnValue(Buffer.from("//JOBCARD"));
        jest.spyOn(JobUtils, "findJobByID").mockResolvedValue("SOME ERROR" as any);

        // Dummy options to touch all `other` branches
        const options: any = { printAttributes: true, size: "1U", secondary: 1, volser: "dummy", unit: "dummy" };
        const response = await CreateDataset.create(connection, 0, "dsname", "jobCard", options);

        expect(connection.submitJCL.mock.calls[0][0]).toMatchSnapshot();
        expect(response.commandResponse).toContain("Failed to create data set");
    });

    describe("Should create datasets successfully", () => {
        const testCreate = async (type: CreateDataSetTypeEnum): Promise<boolean> => {
            const connection = { submitJCL: jest.fn() };
            jest.spyOn(IO, "readFileSync").mockReturnValue(Buffer.from("//JOBCARD"));
            jest.spyOn(JobUtils, "findJobByID").mockResolvedValue("RC=0000" as any);

            const response = await CreateDataset.create(connection, type, "dsname", "jobCard");

            expect(connection.submitJCL.mock.calls[0][0]).toMatchSnapshot();
            expect(response.commandResponse).toContain("Data set created successfully.");
            return response.success;
        }
        it("partitioned", async () => {
            const ret = await testCreate(CreateDataSetTypeEnum.DATA_SET_PARTITIONED);
            expect(ret).toBe(true);
        });

        it("sequential", async () => {
            const ret = await testCreate(CreateDataSetTypeEnum.DATA_SET_SEQUENTIAL);
            expect(ret).toBe(true);
        });

        it("binary", async () => {
            const ret = await testCreate(CreateDataSetTypeEnum.DATA_SET_BINARY);
            expect(ret).toBe(true);
        });

        it("C", async () => {
            const ret = await testCreate(CreateDataSetTypeEnum.DATA_SET_C);
            expect(ret).toBe(true);
        });

        it("classic", async () => {
            const ret = await testCreate(CreateDataSetTypeEnum.DATA_SET_CLASSIC);
            expect(ret).toBe(true);
        });
    });
});
