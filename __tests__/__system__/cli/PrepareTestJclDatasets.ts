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

import { ITransferMode, IUploadDataSetOption } from "../../../src/api";
import { DataSetUtils } from "../../../src/api/DataSetUtils";

export async function prepareTestJclDataSet(connection: any, pds: string, jclName: string): Promise<string> {
    const datasetName = `${pds}(${jclName})`;
    const filteredMembers = await DataSetUtils.listMembers(connection, pds);
    if (filteredMembers.find(member => member.name === jclName) === undefined) {
        const options: IUploadDataSetOption = {
            localFile: `${__dirname}/../../../__tests__/__resources__/${jclName}.JCL`,
            transferType: ITransferMode.ASCII as unknown as ITransferMode,
        };
        await DataSetUtils.uploadDataSet(connection, datasetName, options);
    }
    return datasetName;
}
