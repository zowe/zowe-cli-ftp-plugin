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
    public static async isValidFileName(fileName: string): Promise<boolean> {
        //to prevent magic number eslint errors
        //(valid characters deduced from https://en.wikipedia.org/wiki/ISO/IEC_8859-1)
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

            // Check if the code point is in the range of valid characters
            const validRanges = [
                { start: iso8859_1_start_first, end: iso8859_1_end_first },
                { start: iso8859_1_start_second, end: iso8859_1_end_second }
            ];

            const isValidCharacter = validRanges.some(range => {
                return decimalRepresentation >= range.start && decimalRepresentation <= range.end;
            });

            if (!isValidCharacter) {
                return false;
            }
        }
        return true;
    }
}