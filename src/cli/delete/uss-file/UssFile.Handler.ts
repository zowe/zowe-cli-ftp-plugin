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

import * as path from "path";

import { UssUtils } from "../../../api/UssUtils";
import { FTPBaseHandler } from "../../../FTPBase.Handler";
import { IFTPHandlerParams } from "../../../IFTPHandlerParams";

export default class DeleteUSSFileHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {

        const ussFile = UssUtils.normalizeUnixPath(params.arguments.ussFile);
        this.log.debug("Deleting USS file '%s'", ussFile);

        if (params.arguments.recursive) {
            await this.deleteDirectory(params, ussFile);
        } else {
            await params.connection.deleteDataset(ussFile);
        }

        const successMsg = params.response.console.log("Successfully deleted USS file %s", ussFile);
        params.response.data.setMessage(successMsg);
        this.log.info(successMsg);
    }

    private async deleteDirectory(params: IFTPHandlerParams, ussFile: string): Promise<any> {
        const files = await params.connection.listDataset(ussFile);
        for (const file of files) {
            const filePath = path.join(ussFile, file.name);
            if (file.isDirectory) {
                await this.deleteDirectory(params, filePath);
            } else {
                await params.connection.deleteDataset(filePath);
                params.response.console.log("Deleted %s", filePath);
            }
        }
        await params.connection.deleteDataset(ussFile);
        params.response.console.log("Deleted %s", ussFile);
    }
}

