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

import { IImperativeError, Logger } from "@zowe/imperative";
import { isNullOrUndefined } from "util";

export class CoreUtils {

    /**
     * Sleep for a number of milliseconds
     * @param ms - how many miliseconds to sleep or (at least)
     * @returns promise that resolves when the sleep is complete (or after, not guaranteed)
     */
    public static async sleep(ms: number) {
        this.log.debug("Sleeping for %s milliseconds...", ms);
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    /**
     * Make sure newlines in a string have carriage returns
     * This is required to prevent errors when transferring
     * in ascii mode
     * @param  original - the original string which you would like to ensure has \r before \n
     * @returns a string where every \n has a \r before it
     */
    public static addCarriageReturns(original: string): string {
        this.log.debug("Adding carriage returns to string of length %s", original.length);
        return original.replace(/\r?\n/g, "\r\n");
    }

    /**
     * Read the complete contents of stdin
     * @returns contents piped in to stdin
     */
    public static async readStdin(): Promise<Buffer> {
        return new Promise<Buffer>((resolve, reject) => {
            let stdinContent: Buffer = Buffer.from([]);
            const stream = process.stdin;
            stream.resume();

            stream.on("data", (chunk: Buffer) => {
                this.log.trace(`Read data from stdin: ${chunk.toString()}`);
                this.log.debug(`Read ${chunk.length} bytes of data from stdin`);
                stdinContent = Buffer.concat([stdinContent, chunk]);
            });

            stream.once("end", () => {
                this.log.info("Finished reading stdin");
                resolve(stdinContent);
            });

            stream.on("error", (error: Error) => {
                const stdinReadError: IImperativeError = {
                    msg: "Error encountered while reading from stdin",
                    causeErrors: error,
                    additionalDetails: (isNullOrUndefined(error)) ? undefined : error.message
                };
                reject(stdinReadError);
            });
        });
    }

    protected static get log(): Logger {
        return Logger.getAppLogger();
    }

}
