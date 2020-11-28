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
import { DataSetUtils } from "../../../api/DataSetInterface";
import { TRANSFER_TYPE_ASCII, TRANSFER_TYPE_BINARY } from "../../../api/CoreUtils";

export default class DownloadDataSetHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {

        const file = params.arguments.file == null ?
            ZosFilesUtils.getDirsFromDataSet(params.arguments.dataSet) :
            params.arguments.file;

        let progress;
        if (params.response && params.response.progress) {
            progress = new FTPProgressHandler(params.response.progress, true);
        }
        const options = {
            localFile: file,
            response: params.response,
            transferType: params.arguments.binary ? TRANSFER_TYPE_BINARY : TRANSFER_TYPE_ASCII,
            progress,
        };
        await DataSetUtils.downloadDataSet(params.connection, params.arguments.dataSet, options);

        const successMsg = params.response.console.log(ZosFilesMessages.datasetDownloadedSuccessfully.message, file);
        this.log.info(successMsg);
        params.response.data.setMessage(successMsg);
    }
}
