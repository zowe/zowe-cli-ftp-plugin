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

export default class ListUssFilesHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        const directory = UssUtils.normalizeUnixPath(params.arguments.directory);

        const files = await UssUtils.listFiles(params.connection, directory);

        params.response.data.setMessage("Listed files in uss directory %s", directory);
        params.response.data.setObj(files);
        params.response.format.output({
            output: files,
            format: "table",
            fields: ["name", "size", "owner", "group", "permissions"]
        });
    }
}

