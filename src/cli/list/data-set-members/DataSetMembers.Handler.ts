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
import { DataSetUtils } from "../../../api/DataSetUtils";

export default class ListDataSetMembersHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {

        const filteredMembers = await DataSetUtils.listMembers(params.connection, params.arguments.dsname);
        params.response.data.setObj(filteredMembers);
        const successMsg = params.response.console.log("Successfully listed %d members in data sets %s",
        filteredMembers.length, params.arguments.dsname);
        this.log.info(successMsg);

        params.response.data.setMessage("Successfully listed %d members in data sets %s",
            filteredMembers.length, params.arguments.dsname);
        params.response.format.output({
            output: filteredMembers,
            format: "table",
            fields: ["name"]
        });
    }
}

