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

import { IO } from "@zowe/imperative";
import { CoreUtils } from "../../../api/CoreUtils";
import { IFTPHandlerParams } from "../../../IFTPHandlerParams";
import { FTPBaseHandler } from "../../../FTPBase.Handler";

export default class UploadFileToDataSetHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {

        const transferType = params.arguments.binary ? "binary" : "ascii";
        const uploadSource = "local file '" + params.arguments.file + "'";
        this.log.debug("Attempting to upload from local file '%s' to data set '%s' in transfer mode '%s'",
            params.arguments.file, params.arguments.dataSet, transferType);

        let content: Buffer | string = IO.readFileSync(params.arguments.file, undefined, params.arguments.binary);
        if (!params.arguments.binary) {
            content = CoreUtils.addCarriageReturns(content.toString());
        }

        const dcb = params.arguments.dcb;
        await params.connection.uploadDataset(content, "'" + params.arguments.dataSet + "'", transferType, dcb);

        const successMsg = params.response.console.log("Uploaded from %s to %s ", uploadSource, params.arguments.dataSet);
        params.response.data.setMessage(successMsg);
        this.log.info(successMsg);

    }
}

