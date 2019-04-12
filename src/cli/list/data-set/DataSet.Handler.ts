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

export default class ListDataSetsHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {

        let files: any[];
        this.log.debug("Listing data sets matching pattern '%s' via FTP", params.arguments.pattern);
        files = await params.connection.listDataset(params.arguments.pattern);

        this.log.debug("Found %d matching data sets", files.length);
        const filteredFiles = files.map((file: any) => {
            const result: any = {};
            for (const key of Object.keys(file)) {
                // turn the object into a similar format to that returned by
                // z/osmf so that users who use the list ds command in main
                // brightside can use the same filtering options
                this.log.trace("Remapping key for data set to match core CLI. Old key '%s' New key '%s'", key, key.toLowerCase());
                result[key.toLowerCase()] = file[key];
            }
            return result;
        });
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

