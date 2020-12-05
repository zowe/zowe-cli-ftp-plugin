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
import { JobUtils } from "../../../api";

export default class DeleteJobHandler extends FTPBaseHandler {

    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        await JobUtils.deleteJob(params.connection, params.arguments.jobid);
        const successMsg = params.response.console.log("Successfully deleted job %s", params.arguments.jobid);
        params.response.data.setMessage(successMsg);
        this.log.info(successMsg);
    }
}

