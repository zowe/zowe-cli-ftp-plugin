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
import { CoreUtils, DataSetUtils } from "../../../api";

export default class UploadFileToDataSetHandler extends FTPBaseHandler {

    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        const options = {
            dcb: params.arguments.dcb,
            localFile: params.arguments.file,
            transferType: CoreUtils.getBinaryTransferModeOrDefault(params.arguments.binary),
            encoding: params.arguments.encoding
        };
        await DataSetUtils.uploadDataSet(params.connection, params.arguments.dataSet, options);

        const uploadSource = "local file '" + params.arguments.file + "'";
        const successMsg = params.response.console.log("Uploaded from %s to %s ", uploadSource, params.arguments.dataSet);
        params.response.data.setMessage(successMsg);
        this.log.info(successMsg);
    }
}

