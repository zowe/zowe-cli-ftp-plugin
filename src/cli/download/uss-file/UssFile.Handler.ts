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
import { FTPProgressHandler } from "../../../FTPProgressHandler";
import { IFTPHandlerParams } from "../../../IFTPHandlerParams";
import { UssUtils, TRANSFER_TYPE_ASCII, TRANSFER_TYPE_BINARY  } from "../../../api";

export default class DownloadUssFileHandler extends FTPBaseHandler {

    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        const ussFile = UssUtils.normalizeUnixPath(params.arguments.ussFile);
        const file = params.arguments.file == null ?
            basename(ussFile) : // default the destination file name to the basename of the uss file e.g. /u/users/ibmuser/hello.txt -> hello.txt
            params.arguments.file;

        // Ensure to list directory if ussFile is under symbolic link of directory.
        const files = await UssUtils.listFiles(params.connection, dirname(ussFile) + '/');
        const fileToDownload = files.find((f: any) => {
            return f.name === basename(ussFile);
        });
        if (fileToDownload === undefined) {
            throw new Error(`The file "${ussFile}" doesn't exist.`);
        }

        let progress;
        if (params.response && params.response.progress) {
            progress = new FTPProgressHandler(params.response.progress);
        }

        const options = {
            size: fileToDownload.size,
            localFile: file,
            response: params.response,
            transferType: params.arguments.binary ? TRANSFER_TYPE_BINARY : TRANSFER_TYPE_ASCII,
            progress,
        };
        await UssUtils.downloadFile(params.connection, ussFile, options);

        const successMsg = params.response.console.log("Successfully downloaded USS file '%s' to local file '%s'",
            ussFile, file);
        this.log.info(successMsg);
        params.response.data.setMessage(successMsg);
    }
}

