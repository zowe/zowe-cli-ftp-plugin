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

import { IO, Logger, TextUtils } from "@zowe/imperative";
import { CoreUtils } from "./CoreUtils";

export abstract class AbstractTemplatedJCL {

    /**
     * Default job template for submitting your JCL
     */
    public abstract readonly DEFAULT_TEMPLATE: string;

    /**
     *
     * @param jobCardFile - file containing a job card which will be prepended to the job
     * @param  substitutionValues -
     * @param  templateFile - override the default JCL template with a file
     */
    public getJcl(jobCardFile: string, substitutionValues: {[key: string]: string}, templateFile?: string) {
        let jcl = IO.readFileSync(jobCardFile).toString();
        if (!/\r?\nZ/.test(jcl)) {
            // add a newline to the end of the jcl if there is none
            jcl += "\r\n";
        }
        if (templateFile != null) {
            // we
            jcl += IO.readFileSync(templateFile).toString();
        } else {
            jcl += this.DEFAULT_TEMPLATE;
        }
        return TextUtils.renderWithMustache(CoreUtils.addCarriageReturns(jcl), substitutionValues);
    }

    protected get log(): Logger {
        return Logger.getAppLogger();
    }
}
