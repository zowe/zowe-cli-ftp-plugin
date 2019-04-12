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

export default class UploadStdinToDataSetHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {

        const transferType = params.arguments.binary ? "binary" : "ascii";
        this.log.debug("Attempting to upload from stdin to data set '%s' in transfer mode '%s'",
            params.arguments.dataSet, transferType);

        let content: Buffer | string = await CoreUtils.readStdin();
        if (!params.arguments.binary) {
            content = CoreUtils.addCarriageReturns(content.toString());
        }

        const uploadSource = "stdin";
        const dataSet = params.arguments.dataSet.toUpperCase();

        await params.connection.uploadDataset(content, "'" + dataSet + "'", transferType);

        const successMsg = params.response.console.log("Uploaded from %s to %s ", uploadSource, dataSet);
        params.response.data.setMessage(successMsg);
        this.log.info(successMsg);
    }
}

