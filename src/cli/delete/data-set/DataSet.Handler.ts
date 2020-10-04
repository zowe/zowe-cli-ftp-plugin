import { DataSetUtils } from "../../../api/DataSetUtils";
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

export default class DeleteDataSetHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        await DataSetUtils.deleteDataSet(params.connection, params.arguments.dataSet);
        const successMsg = params.response.console.log("Successfully deleted data set file %s", params.arguments.dataSet);
        params.response.data.setMessage(successMsg);
        this.log.info(successMsg);
    }
}

