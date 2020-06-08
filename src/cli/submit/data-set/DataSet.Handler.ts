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

import { IO } from "@zowe/imperative";
import { JobUtils } from "../../../api/JobUtils";
import { FTPBaseHandler } from "../../../FTPBase.Handler";
import { IFTPHandlerParams } from "../../../IFTPHandlerParams";
import { SubmitJobHandler } from "../SubmitJobHandler";

export default class SubmitJobFromLocalFileHandler extends SubmitJobHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        // tslint:disable-next-line: prefer-const
        this.log.debug("Submitting a job from data set '%s'. Downloading before submitting...", params.arguments.dataSet);
        const dsContent = (await params.connection.getDataset("'" + params.arguments.dataSet + "'")).toString();
        this.log.debug("Downloaded data set '%s'. Submitting...", params.arguments.dataSet);
        return this.submitJCL(dsContent, params);
    }
}

