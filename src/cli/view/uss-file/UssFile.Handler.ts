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

import { basename, dirname } from "path";
import { FTPBaseHandler } from "../../../FTPBase.Handler";
import { IFTPHandlerParams } from "../../../IFTPHandlerParams";
import { UssUtils, IDatasetEntry, CoreUtils } from "../../../api";

export default class ViewUssFileHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        const ussFile = UssUtils.normalizeUnixPath(params.arguments.ussFile);

        // Ensure to list directory if ussFile is under symbolic link of directory.
        const files = await UssUtils.listFiles(params.connection, dirname(ussFile) + '/');
        const fileToDownload = files.find((f: IDatasetEntry) => {
            return f.name === basename(ussFile);
        });
        if (fileToDownload === undefined) {
            throw new Error(`The file "${ussFile}" doesn't exist.`);
        }

        const options = {
            transferType: CoreUtils.getBinaryTransferModeOrDefault(params.arguments.binary),
            response: params.response,
            size: fileToDownload.size,
        };
        const content = await UssUtils.downloadFile(params.connection, params.arguments.ussFile, options);

        params.response.data.setObj(content);
        params.response.console.log(content);
    }
}

