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

import { StreamUtils } from "../../../api/StreamUtils";
import { UssUtils } from "../../../api/UssUtils";
import { FTPBaseHandler } from "../../../FTPBase.Handler";
import { IFTPHandlerParams } from "../../../IFTPHandlerParams";
import { basename, dirname } from "path";

export default class ViewUssFileHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        const ussFile = UssUtils.normalizeUnixPath(params.arguments.ussFile);
        const transferType = params.arguments.binary ? "binary" : "ascii";


        const files = await params.connection.listDataset(dirname(ussFile));
        const fileToDownload = files.find((f: any) => {
            return f.name === basename(ussFile);
        });
        if (fileToDownload === undefined) {
            throw new Error(`The file "${ussFile}" doesn't exist.`);
        }

        let content: Buffer;

        const contentStreamPromise = params.connection.getDataset(UssUtils.normalizeUnixPath(params.arguments.ussFile),
            transferType, true);
        content = await StreamUtils.streamToBuffer(fileToDownload.size, contentStreamPromise, params.response);

        params.response.data.setObj(content);
        params.response.console.log(content);
    }
}

