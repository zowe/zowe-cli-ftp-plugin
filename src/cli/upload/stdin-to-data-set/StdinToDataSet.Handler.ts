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

import { CoreUtils } from "../../../api/CoreUtils";
import { IFTPHandlerParams } from "../../../IFTPHandlerParams";
import { FTPBaseHandler } from "../../../FTPBase.Handler";
import { DataSetUtils } from "../../../api/DataSetUtils";

export default class UploadStdinToDataSetHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {

        const content: Buffer | string = await CoreUtils.readStdin();

        const options = {
            dcb: params.arguments.dcb,
            transferType: params.arguments.binary ? "binary" : "ascii",
        };
        await DataSetUtils.uploadDataSet(params.connection, params.arguments.dataSet, content, options);

        const uploadSource = "stdin";
        const successMsg = params.response.console.log("Uploaded from %s to %s ", uploadSource, params.arguments.dataSet);
        params.response.data.setMessage(successMsg);
        this.log.info(successMsg);
    }
}

