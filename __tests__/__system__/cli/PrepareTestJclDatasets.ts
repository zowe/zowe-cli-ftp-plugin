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

import { DataSetUtils } from "../../../src/api/DataSetUtils";
import { TRANSFER_TYPE_ASCII } from "../../../src/api/CoreUtils";

export async function prepareTestJclDataSet(connection: any, pds: string, jclName: string): Promise<string> {
    const datasetName = `${pds}(${jclName})`;
    const filteredMembers = await DataSetUtils.listMembers(connection, pds);
    if (filteredMembers.find(member => member === jclName) === undefined) {
        const options = {
            localFile: `${__dirname}/../../../__tests__/__resources__/${jclName}.JCL`,
            transferType: TRANSFER_TYPE_ASCII,
        };
        await DataSetUtils.uploadDataSet(connection, datasetName, options);
    }
    return datasetName;
}
