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
import { UssUtils } from "../../../api/UssUtils";

export default class RenameUssFileHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {

        const oldUssFile = UssUtils.normalizeUnixPath(params.arguments.olduss);
        const newUssFile = UssUtils.normalizeUnixPath(params.arguments.newuss);
        this.log.debug("Attempting to rename USS file or directory from '%s' to '%s'",
            oldUssFile, newUssFile);

        await params.connection.rename(oldUssFile, newUssFile);

        const successMessage = params.response.console.log("Successfully renamed USS file or directory from '%s' to '%s'",
            oldUssFile, newUssFile);
        this.log.info(successMessage);
        params.response.data.setMessage(successMessage);
    }
}

