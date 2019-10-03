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

import * as fs from "fs";

import { IO } from "@brightside/imperative";
import { StreamUtils } from "../../../api/StreamUtils";
import { FTPBaseHandler } from "../../../FTPBase.Handler";
import { IFTPHandlerParams } from "../../../IFTPHandlerParams";
import { UssUtils } from "../../../api/UssUtils";
import { basename, dirname } from "path";

export default class DownloadUssFileHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        const ussFile = UssUtils.normalizeUnixPath(params.arguments.ussFile);
        const transferType = params.arguments.binary ? "binary" : "ascii";
        const file = params.arguments.file == null ?
            basename(ussFile) : // default the destination file name to the basename of the uss file e.g. /u/users/ibmuser/hello.txt -> hello.txt
            params.arguments.file;

        const files = await params.connection.listDataset(dirname(ussFile));
        const fileToDownload = files.find((f: any) => {
            return f.name === basename(ussFile);
        });
        if (fileToDownload === undefined) {
            throw new Error(`The file "${ussFile}" doesn't exist.`);
        }

        this.log.debug("Downloading USS file '%s' to local file '%s' in transfer mode '%s",
            ussFile, file, transferType);
        IO.createDirsSyncFromFilePath(file);

        const contentStreamPromise = params.connection.getDataset(ussFile, transferType, true);
        const writable = fs.createWriteStream(file);
        await StreamUtils.streamToStream(fileToDownload.size, contentStreamPromise, writable, params.response);

        const successMsg = params.response.console.log("Successfully downloaded USS file '%s' to local file '%s'",
            ussFile, file);
        this.log.info(successMsg);
        params.response.data.setMessage(successMsg);
    }
}

