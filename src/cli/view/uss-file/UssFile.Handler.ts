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

import { StreamUtils } from "../../../api/StreamUtils";
import { UssUtils } from "../../../api/UssUtils";
import { FTPBaseHandler } from "../../../FTPBase.Handler";
import { IFTPHandlerParams } from "../../../IFTPHandlerParams";

export default class ViewUssFileHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        const transferType = params.arguments.binary ? "binary" : "ascii";

        let content: Buffer;

        const contentStreamPromise = params.connection.getDataset(UssUtils.normalizeUnixPath(params.arguments.ussFile),
            transferType, true);
        content = await StreamUtils.streamToBuffer(contentStreamPromise, params.response);

        params.response.data.setObj(content);
        params.response.console.log(content);
    }
}

