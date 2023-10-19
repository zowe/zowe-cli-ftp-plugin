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

import { ZosFilesMessages, ZosFilesUtils } from "@zowe/cli";
import { FTPBaseHandler } from "../../../FTPBase.Handler";
import { IFTPHandlerParams } from "../../../IFTPHandlerParams";
import { FTPProgressHandler } from "../../../FTPProgressHandler";
import { DataSetUtils, TRANSFER_TYPE_ASCII, TRANSFER_TYPE_ASCII_RDW, TRANSFER_TYPE_BINARY, TRANSFER_TYPE_BINARY_RDW } from "../../../api";
import { ImperativeError } from "@zowe/imperative";

function isValidFileName(fileName: string) {
    //to prevent magic number eslint errors
    const iso8859_1_start_first = 32; // first valid code point for first chunk of valid characters in the ISO/IEC 8859-1 table
    const iso8859_1_end_first = 127;
    const iso8859_1_start_second = 160; //second chunk of valid characters
    const iso8859_1_end_second = 255;
    const binary = 2;
    const hexadecimal = 16;

    const unicodeString = fileName.split('').map(char => `U+${char.charCodeAt(0).toString(hexadecimal).toUpperCase()}`).join(' ');
    const codePoints = unicodeString.split(' ');

    for (const codePoint of codePoints) {
        // Extract the decimal representation from the code point (e.g., ☻ = U+263B => 9787)
        const decimalRepresentation = parseInt(codePoint.substring(binary), hexadecimal);

        // Check if the code point is in the range of valid characters (valid numbers deduced from https://en.wikipedia.org/wiki/ISO/IEC_8859-1)
        if ((decimalRepresentation >= iso8859_1_start_first && decimalRepresentation <= iso8859_1_end_first) ||
            (decimalRepresentation >= iso8859_1_start_second && decimalRepresentation <= iso8859_1_end_second))
        {
            // If any invalid code point is found, return false
            return false;
        }
    }
    return true;
}
export default class DownloadDataSetHandler extends FTPBaseHandler {
    public async processFTP(params: IFTPHandlerParams): Promise<void> {

        const file = params.arguments.file == null ?
            ZosFilesUtils.getDirsFromDataSet(params.arguments.dataSet) :
            params.arguments.file;

        // Validate the file name before proceeding
        if (!isValidFileName(file)) {
            throw new ImperativeError({msg: "Invalid file name. Please check the file name for typos."});
        }

        let progress;
        if (params.response && params.response.progress) {
            progress = new FTPProgressHandler(params.response.progress, true);
        }
        let transferType = params.arguments.binary ? TRANSFER_TYPE_BINARY : TRANSFER_TYPE_ASCII;
        if (params.arguments.rdw) {
            transferType = params.arguments.binary ? TRANSFER_TYPE_BINARY_RDW : TRANSFER_TYPE_ASCII_RDW;
        }
        const options = {
            localFile: file,
            response: params.response,
            transferType,
            progress,
            encoding: params.arguments.encoding
        };
        await DataSetUtils.downloadDataSet(params.connection, params.arguments.dataSet, options);

        const successMsg = params.response.console.log(ZosFilesMessages.datasetDownloadedSuccessfully.message, file);
        this.log.info(successMsg);
        params.response.data.setMessage(successMsg);
    }
}
