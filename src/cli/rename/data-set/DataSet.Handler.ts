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

export default class RenameDataSetHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {

        await DataSetUtils.renameDataSet(params.connection, params.arguments.oldDataSet, params.arguments.newDataSet);

        const successMessage = params.response.console.log("Successfully renamed data set from '%s' to '%s'",
            params.arguments.oldDataSet, params.arguments.newDataSet);
        params.response.data.setMessage(successMessage);

    }
}

