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

import * as crypto from "crypto";

/**
 * Generate random bytes for binary tests
 * @param  len - number of bytes to generate
 * @returns promise that resolves to a buffer of random bytes
 */
export async function generateRandomBytes(len: number): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
        crypto.randomBytes(len, (randomErr, randomData: Buffer) => {
            if (randomErr != null) {
                reject(randomErr);
                return;
            }
            // To void the zero-ending byte like 0x00, or 0xE0
            const NON_ZERO = 0xCC;
            randomData[len - 1] = NON_ZERO;
            resolve(randomData);
        });
    });
}

/**
 * This function strips any new lines out of the string passed.
 * @param str A string to remove new lines
 * @returns  A string without new lines
 */
export function stripNewLines(str: string): string {
    return str
        .replace(/\n+/g, " ")
        .trim();
    // .replace(/\S\S+/g, " "); // Strips out areas of more than one space
}

/**
 * This function leverage unix time stamp (ms since epoch) along with user specified
 * high level qualify to generate unique data set name to be used for testing.
 * @param {string} hlq User specified high level qualify
 * @returns {string} A generated data set name
 */
export function getUniqueDatasetName(hlq: string): string {
    let generatedName: string = "";
    let timestampInMs: string = Date.now().toString();
    let tempStr: string;
    const MAX_NODE_LENGTH = 7;

    while (timestampInMs.length > 0) {
        tempStr = timestampInMs.substring(0, MAX_NODE_LENGTH);
        generatedName += `A${tempStr}`;
        timestampInMs = timestampInMs.slice(tempStr.length, timestampInMs.length);

        if (timestampInMs.length > 0) {
            generatedName += ".";
        }
    }

    return `${hlq.trim()}.${generatedName}`.toUpperCase();
}


/**
 *
 * @param length - how long should the string be
 * @param  upToLength -  if true, length is the maximum length of the string.
 *                               (generate a string 'up to' length characters long)
 * @returns  the random string
 */
export function generateRandomAlphaNumericString(length: number, upToLength: boolean = false): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    if (upToLength) {
        length = Math.floor(Math.random() * length) + 1;
    }
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

/**
 * Generate a random data set name for use in testing
 * @param hlq - high level qualifier for the
 * @param  length - length of each segment
 * @returns the randomly generated data set name
 */
export function randomDsName(hlq: string, length: number = 7, numSegments: number = 3) {
    let dsname = hlq;
    for (let segmentIndex = 0; segmentIndex < numSegments; segmentIndex++) {
        dsname += ".R" + generateRandomAlphaNumericString(length);
    }
    return dsname.toUpperCase();
}
