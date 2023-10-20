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

export class Utilities{
    /**
     * Check to ensure filename only contains valid characters
     * @param {fileName} string - filename to be evaluated
     * @returns {Promise<boolean>} - promise that resolves to true if filename contains valid characters
     * @memberof Utilities
     */
    public static isValidFileName(fileName: string): boolean {
        // Define valid character ranges for ISO/IEC 8859-1 https://en.wikipedia.org/wiki/ISO/IEC_8859-1
        const validRanges = [
            { start: 32, end: 127 },   // First chunk of valid characters
            { start: 160, end: 255 }  // Second chunk of valid characters
        ];

        // Check if each character in the filename is within a valid range
        for (const char of fileName) {
            const charCode = char.charCodeAt(0);
            if (!validRanges.some(range => charCode >= range.start && charCode <= range.end)) {
                return false;
            }
        }

        return true;
    }
}