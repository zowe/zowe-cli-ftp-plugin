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

import { FTPBaseHandler } from "../../../FTPBase.Handler";
import { IFTPHandlerParams } from "../../../IFTPHandlerParams";
import { UssUtils, CoreUtils } from "../../../api";

export default class UploadFileToUssFileHandler extends FTPBaseHandler {

    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        const ussFile = UssUtils.normalizeUnixPath(params.arguments.ussFile);
        UssUtils.checkAbsoluteFilePath(ussFile);
        const options = {
            localFile: params.arguments.file,
            transferType: CoreUtils.getBinaryTransferModeOrDefault(params.arguments.binary),
        };
        await UssUtils.uploadFile(params.connection, ussFile, options);

        const uploadSource: string = "local file '" + params.arguments.file + "'";
        const successMsg = params.response.console.log("Uploaded from %s to %s ", uploadSource, ussFile);
        params.response.data.setMessage(successMsg);
        this.log.info(successMsg);
    }
}

