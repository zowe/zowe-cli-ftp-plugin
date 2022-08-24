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
import { DataSetUtils, TRANSFER_TYPE_ASCII, TRANSFER_TYPE_BINARY } from "../../../api";

export default class ViewDataSetHandler extends FTPBaseHandler {

    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        const options = {
            transferType: params.arguments.binary ? TRANSFER_TYPE_BINARY : TRANSFER_TYPE_ASCII,
            response: params.response,
            encoding: params.arguments.encoding
        };
        this.log.debug("Attempting to view data set '%s' in transfer mode '%s'", params.arguments.dataSet, options.transferType);
        const content = await DataSetUtils.downloadDataSet(params.connection, params.arguments.dataSet, options);

        this.log.info("Successfully downloaded %d bytes of content from %s", content.length, params.arguments.dataSet);
        params.response.data.setObj(content);
        params.response.console.log(content);
    }
}

