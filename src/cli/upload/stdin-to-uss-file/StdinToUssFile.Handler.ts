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

import { UssUtils } from "../../../api/UssUtils";
import { CoreUtils } from "../../../api/CoreUtils";
import { FTPBaseHandler } from "../../../FTPBase.Handler";
import { IFTPHandlerParams } from "../../../IFTPHandlerParams";

export default class UploadStdinToUssFileHandler extends FTPBaseHandler {

    public async processFTP(params: IFTPHandlerParams): Promise<void> {

        const transferType = params.arguments.binary ? "binary" : "ascii";
        const ussFile = UssUtils.normalizeUnixPath(params.arguments.ussFile);
        this.log.debug("Attempting to upload from stdin to USS file'%s' in transfer mode '%s'",
            ussFile, transferType);
        let content: Buffer | string = await CoreUtils.readStdin();
        if (!params.arguments.binary) {
            content = CoreUtils.addCarriageReturns(content.toString());
        }

        const uploadSource: string = "stdin";

        await params.connection.uploadDataset(content, ussFile, transferType);

        const successMsg = params.response.console.log("Uploaded from %s to %s ", uploadSource, ussFile);
        params.response.data.setMessage(successMsg);
        this.log.info(successMsg);

    }
}

