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
import { DataSetUtils } from "../../../api";

export default class LikeDataSetHandler extends FTPBaseHandler {

    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        const options = {
            dcb: params.arguments.dcb
        };
        await DataSetUtils.allocateLikeDataSet(params.connection, params.arguments.datasetName, params.arguments.like);

        const successMsg = params.response.console.log("Allocated dataset %s like %s successfully!", params.arguments.datasetName, params.arguments.like);
        params.response.data.setMessage(successMsg);
        this.log.info(successMsg);
    }
}
