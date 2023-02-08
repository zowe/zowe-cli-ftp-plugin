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

export default class AllocateDataSetHandler extends FTPBaseHandler {

    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        const pResp = params.response;
        const pArgs = params.arguments;
        const options = {
            dcb: pArgs.dcb
        };
        let successMsg: string = "";
        if (pArgs.like) {
            await DataSetUtils.allocateLikeDataSet(params.connection, pArgs.datasetName, pArgs.like);
            successMsg = pResp.console.log("Allocated dataset %s like %s successfully!", pArgs.datasetName, pArgs.like);
        } else {
            await DataSetUtils.allocateDataSet(params.connection, pArgs.datasetName, options);
            successMsg = pResp.console.log("Allocated dataset %s successfully!", pArgs.datasetName);
        }
        pResp.data.setMessage(successMsg);
        this.log.info(successMsg);
    }
}
