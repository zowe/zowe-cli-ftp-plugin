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
import { IFTPHandlerParams } from "../../../IFTPHandlerParams";
import { SubmitJobHandler } from "../SubmitJobHandler";


export default class SubmitJobFromLocalFileHandler extends SubmitJobHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {
        this.log.debug("Submitting a job from local file %s", params.arguments.file);
        const fileContent = IO.readFileSync(params.arguments.file);
        return this.submitJCL(fileContent.toString(), params);
    }
}

