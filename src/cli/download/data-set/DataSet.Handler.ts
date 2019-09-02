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
import { ZosFilesMessages, ZosFilesUtils } from "@brightside/core";
import { FTPBaseHandler } from "../../../FTPBase.Handler";
import { IFTPHandlerParams } from "../../../IFTPHandlerParams";

export default class DownloadDataSetHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {

        const transferType = params.arguments.binary ? "binary" : "ascii";
        const file = params.arguments.file == null ?
            ZosFilesUtils.getDirsFromDataSet(params.arguments.dataSet) :
            params.arguments.file;
        const writable = fs.createWriteStream(file);
        this.log.debug("Downloading data set '%s' to local file '%s' in transfer mode '%s",
            params.arguments.dataSet, file, transferType);
        IO.createDirsSyncFromFilePath(file);
        const contentStreamPromise = params.connection.getDataset(params.arguments.dataSet, transferType, true);
        await StreamUtils.streamToStream(contentStreamPromise, writable, params.response);

        const successMsg = params.response.console.log(ZosFilesMessages.datasetDownloadedSuccessfully.message,
            file);
        this.log.info(successMsg);
        params.response.data.setMessage(successMsg);
    }
}

