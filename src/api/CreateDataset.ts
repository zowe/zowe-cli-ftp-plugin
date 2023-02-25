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

import { CreateDataSetTypeEnum, CreateDefaults, ICreateDataSetOptions, IZosFilesResponse, ZosFilesMessages } from "@zowe/cli";
import { ImperativeError, ImperativeExpect, TextUtils } from "@zowe/imperative";
import { JobUtils } from "./JobUtils";
import { CoreUtils } from "./CoreUtils";
import { AbstractTemplatedJCL } from "./AbstractTemplatedJCL";

export class CreateDataset extends AbstractTemplatedJCL {

    /**
     * Create a data set
     * @param connection                 - zos-node-accessor connection
     * @param  cmdType               - The type of data set we are going to create
     * @param dataSetName                          - the name of the data set to create
     * @param  [options={}] - additional options for the creation of the data set
     */
    public static async create(connection: any, cmdType: CreateDataSetTypeEnum,
        dataSetName: string,
        jobCardFile: string,
        options ?: Partial<ICreateDataSetOptions>):
        Promise<IZosFilesResponse> {
        let validCmdType = true;

        // Removes undefined properties
        let tempOptions = options != null ? JSON.parse(JSON.stringify(options)) : {};
        const secondarySpecified = tempOptions.secondary != null;

        // Required
        ImperativeExpect.toNotBeNullOrUndefined(cmdType, ZosFilesMessages.missingDatasetType.message);

        // Required
        ImperativeExpect.toNotBeNullOrUndefined(dataSetName, ZosFilesMessages.missingDatasetName.message);

        switch (cmdType) {
            case CreateDataSetTypeEnum.DATA_SET_PARTITIONED:
                tempOptions = {...CreateDefaults.DATA_SET.PARTITIONED, ...tempOptions};
                break;
            case CreateDataSetTypeEnum.DATA_SET_SEQUENTIAL:
                tempOptions = {...CreateDefaults.DATA_SET.SEQUENTIAL, ...tempOptions};
                break;
            case CreateDataSetTypeEnum.DATA_SET_BINARY:
                tempOptions = {...CreateDefaults.DATA_SET.BINARY, ...tempOptions};
                break;
            case CreateDataSetTypeEnum.DATA_SET_C:
                tempOptions = {...CreateDefaults.DATA_SET.C, ...tempOptions};
                break;
            case CreateDataSetTypeEnum.DATA_SET_CLASSIC:
                tempOptions = {...CreateDefaults.DATA_SET.CLASSIC, ...tempOptions};
                break;
            default:
                validCmdType = false;
                break;
        }

        if (!validCmdType) {
            throw new ImperativeError({msg: ZosFilesMessages.unsupportedDatasetType.message});
        } else {
            // Handle the size option
            if (tempOptions.size != null) {
                const tAlcunit = tempOptions.size.toString().match(/[a-zA-Z]+/g);
                if (tAlcunit != null) {
                    tempOptions.alcunit = tAlcunit.join("").toUpperCase();
                }

                const tPrimary = tempOptions.size.toString().match(/[0-9]+/g);
                if (tPrimary != null) {
                    tempOptions.primary = +(tPrimary.join(""));

                    if (!secondarySpecified) {
                        const TEN_PERCENT = 0.10;
                        tempOptions.secondary = Math.round(tempOptions.primary * TEN_PERCENT);
                    }
                }

                delete tempOptions.size;
            }

            let response = "";
            // Handle the print attributes option
            if (tempOptions.printAttributes != null) {
                if (tempOptions.printAttributes) {
                    delete tempOptions.printAttributes;
                    response = TextUtils.prettyJson(tempOptions);
                } else {
                    delete tempOptions.printAttributes;
                }
            }

            response = await new CreateDataset().createViaFTP(connection, dataSetName, tempOptions, jobCardFile);
            if (response.indexOf("RC=0000") >= 0) {
                return {
                    success: true,
                    commandResponse: response + "\n" + ZosFilesMessages.dataSetCreatedSuccessfully.message,
                }
            } else {
                return {
                    success: false,
                    commandResponse: response + "\nFailed to create data set",
                }
            }
        }
    }


    public DEFAULT_TEMPLATE = "//CREATE EXEC PGM=IEFBR14\n" +
        "//{{createDD}}";

    private async createViaFTP(connection: any, dataSetName: string,
        options: ICreateDataSetOptions,
        jobCardFile: string,
        overrideTemplateFile ?: string) {
        this.log.debug("Building jcl to create data set %s", dataSetName);

        let createDD: string = "NEWDATA DD ";
        const createDDValues = ["DSN=" + dataSetName.toUpperCase(), "DISP=(NEW,CATLG)"];
        const maxDDLineLength = 65;
        let currentLineLength = createDD.length;
        const continueLine = "//   ";

        // todo: make sure all options are used here
        if (options.alcunit) {
            let spaceParams = "SPACE=(";
            spaceParams += options.alcunit.toUpperCase() + ",(";
            spaceParams += options.primary;
            if (options.secondary != null) {
                spaceParams += "," + options.secondary;
            }
            spaceParams += "))";

            createDDValues.push(spaceParams);
            if (options.volser != null) {
                createDDValues.push("VOLSER=" + options.volser.toUpperCase());
            }
        }
        if (options.lrecl != null) {
            createDDValues.push("LRECL=" + options.lrecl);
        }
        if (options.recfm != null) {
            createDDValues.push("RECFM=" + options.recfm.toUpperCase());
        }
        if (options.blksize != null) {
            createDDValues.push("BLKSIZE=" + options.blksize);
        }
        if (options.unit != null) {
            createDDValues.push("UNIT=" + options.unit.toUpperCase());
        }

        if (options.dsorg != null) {
            createDDValues.push("DSORG=" + options.dsorg.toUpperCase());
        }

        /**
         * Build the DD definition for the job by looping through the values we've built
         */
        for (let i = 0; i < createDDValues.length; i++) {
            const value = createDDValues[i];
            if (value.length + currentLineLength > maxDDLineLength) {
                createDD += "\n" + continueLine;
                currentLineLength = continueLine.length;
            }

            createDD += value;
            if (i < createDDValues.length - 1) {
                // if this isn't the last value, add a comma to continue the line
                createDD += ",";
                currentLineLength += 1;
            }
            currentLineLength += value.length;
        }

        const jcl = this.getJcl(jobCardFile, {createDD}, overrideTemplateFile);
        this.log.debug("Creating data set %s via JCL:\n %s", dataSetName, jcl);
        const jobid = await connection.submitJCL(jcl);
        const jobWait = 500;
        await CoreUtils.sleep(jobWait); // have to wait for the job to show up in the list
        const jobDetails = await JobUtils.findJobByID(connection, jobid);
        return "Job details: " + JSON.stringify(jobDetails, null, 2);
    }

}
