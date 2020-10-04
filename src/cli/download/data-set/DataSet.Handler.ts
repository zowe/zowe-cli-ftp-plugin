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
import { DataSetUtils } from "../../../api/DataSetUtils";

export default class DownloadDataSetHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {

        const file = params.arguments.file == null ?
            ZosFilesUtils.getDirsFromDataSet(params.arguments.dataSet) :
            params.arguments.file;

        const options = {
            localFile: file,
            response: params.response,
            transferType: params.arguments.binary ? "binary" : "ascii",
        };
        try {
            await DataSetUtils.downloadDataSet(params.connection, params.arguments.dataSet, options);
        } catch (e) {
            this.log.error(e);
        }

        const successMsg = params.response.console.log(ZosFilesMessages.datasetDownloadedSuccessfully.message, file);
        this.log.info(successMsg);
        params.response.data.setMessage(successMsg);
    }
}

