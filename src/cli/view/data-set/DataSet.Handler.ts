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
import { IFTPHandlerParams } from "../../../IFTPHandlerParams";
import { FTPBaseHandler } from "../../../FTPBase.Handler";

export default class ViewDataSetHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        const transferMode = params.arguments.binary ? "binary" : "ascii";

        let content: Buffer;
        this.log.debug("Attempting to view data set '%s' in transfer mode '%s'", params.arguments.dataSet, transferMode);
        const contentStreamPromise = params.connection.getDataset(params.arguments.dataSet, transferMode, true);
        content = await StreamUtils.streamToBuffer(contentStreamPromise, params.response);
        this.log.info("Successfully downloaded %d bytes of content from %s", content.length, params.arguments.dataSet);
        params.response.data.setObj(content);
        params.response.console.log(content);
    }
}

