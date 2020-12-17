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
import { UssUtils } from "../../../api";

export default class MakeUssDirectoryHandler extends FTPBaseHandler {

    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        const ussDirectory = UssUtils.normalizeUnixPath(params.arguments.ussDirectory);

        await UssUtils.makeDirectory(params.connection, ussDirectory);

        const successMsg = params.response.console.log("Make USS directory %s successfully!", ussDirectory);
        params.response.data.setMessage(successMsg);
        this.log.info(successMsg);
    }
}
