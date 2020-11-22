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
import { DataSetUtils } from "../../../api/DataSetInterface";

export default class ListDataSetsHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {

        const filteredFiles = await DataSetUtils.listDataSets(params.connection, params.arguments.pattern);
        params.response.data.setObj(filteredFiles);
        params.response.data.setMessage("Successfully listed %d matching data sets for pattern '%s'",
            filteredFiles.length, params.arguments.pattern);
        params.response.format.output({
            output: filteredFiles,
            format: "table",
            fields: ["dsname"]
        });
    }
}

