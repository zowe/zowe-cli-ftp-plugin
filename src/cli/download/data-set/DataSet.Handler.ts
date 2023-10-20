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

import { ZosFilesMessages, ZosFilesUtils } from "@zowe/cli";
import { FTPBaseHandler } from "../../../FTPBase.Handler";
import { IFTPHandlerParams } from "../../../IFTPHandlerParams";
import { FTPProgressHandler } from "../../../FTPProgressHandler";
import { DataSetUtils, TRANSFER_TYPE_ASCII, TRANSFER_TYPE_ASCII_RDW, TRANSFER_TYPE_BINARY, TRANSFER_TYPE_BINARY_RDW } from "../../../api";
import { ImperativeError } from "@zowe/imperative";
import { Utilities } from "../../Utilities";

export default class DownloadDataSetHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        const file = params.arguments.file == null ?
            ZosFilesUtils.getDirsFromDataSet(params.arguments.dataSet) :
            params.arguments.file;
        try {
            // Validate the destination file name before proceeding
            if (!(await Utilities.isValidFileName(file))) {
                throw new ImperativeError({ msg: ZosFilesMessages.invalidFileName.message });
            }

            let progress;
            if (params.response && params.response.progress) {
                progress = new FTPProgressHandler(params.response.progress, true);
            }
            let transferType = params.arguments.binary ? TRANSFER_TYPE_BINARY : TRANSFER_TYPE_ASCII;
            if (params.arguments.rdw) {
                transferType = params.arguments.binary ? TRANSFER_TYPE_BINARY_RDW : TRANSFER_TYPE_ASCII_RDW;
            }
            const options = {
                localFile: file,
                response: params.response,
                transferType,
                progress,
                encoding: params.arguments.encoding
            };
            await DataSetUtils.downloadDataSet(params.connection, params.arguments.dataSet, options);

            const successMsg = params.response.console.log(ZosFilesMessages.datasetDownloadedSuccessfully.message, file);
            this.log.info(successMsg);
            params.response.data.setMessage(successMsg);
        }
        catch (e) {
            if (e instanceof ImperativeError){
                throw e;
            }
            throw new ImperativeError({
                msg: `An error was encountered while trying to download your file '${file}'.\nError details: ${e.message}`
            });
        }
    }
}
