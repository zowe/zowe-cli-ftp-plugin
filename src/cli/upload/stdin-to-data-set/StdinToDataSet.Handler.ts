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

import { IFTPHandlerParams } from "../../../IFTPHandlerParams";
import { FTPBaseHandler } from "../../../FTPBase.Handler";
import { CoreUtils, DataSetUtils, TRANSFER_TYPE_ASCII, TRANSFER_TYPE_BINARY } from "../../../api";

export default class UploadStdinToDataSetHandler extends FTPBaseHandler {

    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        const content: Buffer | string = await CoreUtils.readStdin(params.stdin);

        const options = {
            content,
            dcb: params.arguments.dcb,
            transferType: params.arguments.binary ? TRANSFER_TYPE_BINARY : TRANSFER_TYPE_ASCII,
        };
        const dataSet = params.arguments.dataSet.toUpperCase();
        await DataSetUtils.uploadDataSet(params.connection, dataSet, options);

        const uploadSource = "stdin";
        const successMsg = params.response.console.log("Uploaded from %s to %s ", uploadSource, dataSet);
        params.response.data.setMessage(successMsg);
        this.log.info(successMsg);
    }
}

