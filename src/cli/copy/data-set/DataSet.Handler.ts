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

export default class DownloadDataSetHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        const pResp = params.response;
        const pArgs = params.arguments;
        const progress = new FTPProgressHandler(params.response.progress, true);
        await DataSetUtils.copyDataSet(params.connection, {
            fromDsn: pArgs.fromDataSetName,
            toDsn: pArgs.toDataSetName,
            progress,
            replace: pArgs.replace ?? false,
        });

        const successMsg = pResp.console.log("Copied dataset %s to %s successfully!", pArgs.fromDataSetName, pArgs.toDataSetName);
        this.log.info(successMsg);
        params.response.data.setMessage(successMsg);
    }
}
