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
import { join } from "path";
import { CoreUtils } from "./CoreUtils";

const filewatcher = require("filewatcher");

export class EditFilesViaFTP {
    /**
     * Initiate a watch - downloads the file and starts a file watcher. You must terminate when complete
     * @param connection - connection to zos-node-accessor
     * @param dataset - the data set name to watch
     * @param  watchEvent - function to handle when the file is changed
     */
    public static async watch(connection: any, dataset: string, ext: string,
                              watchEvent: (message: string, terminated: boolean) => void,
                              binary?: boolean): Promise<{ watcher: any; filename: string }> {
        // Download and save the contents
        const contents = await EditFilesViaFTP.download(connection, dataset, binary);
        const filename = EditFilesViaFTP.save(dataset, contents, ext);

        // Create the watcher
        const watcher = filewatcher();
        watcher.add(filename);
        watcher.on("change", (file: string, stat: any) => {

            // If file was deleted, stop the watch
            if (stat.deleted) {
                watchEvent(`Local file deleted. Terminating watch...`, true);
                watcher.remove(filename);
            } else {

                EditFilesViaFTP.upload(connection, dataset, IO.readFileSync(file, false, binary)).then(() => {
                    // Indicate success or failure
                    watchEvent(`${filename} uploaded successfully.`, false);
                }).catch((uploadErr) => {
                    watcher.remove(filename);
                    connection.close();
                    watchEvent(`Terminating watch: ${uploadErr.message}`, true);
                });
            }
        });

        return {watcher, filename};
    }

    public static async terminate(watcher: any, filename: string, connection: any) {
        watcher.remove(filename);
        IO.deleteFile(filename);
        connection.close();
    }

    /**
     * The URI for files
     */
    private static readonly URI: string = "/zosmf/restfiles/ds/";

    /**
     * Download the contents of a data set
     */
    private static async download(connection: any, dataset: string, binary?: boolean) {
        const transferType = binary ? "binary" : "ascii";
        return connection.getDataset("'" + dataset + "'", transferType, false); // false - don't stream, return buffer
    }

    /**
     * Upload the contents of a data-set
     * @param connection - the zos-node-accessor connection
     * @param binary - transfer in binary?
     */
    private static async upload(connection: any, dataset: string,
                                contents: string | Buffer, binary?: boolean) {
        const transferType = binary ? "binary" : "ascii";
        if (!binary) {
            contents = CoreUtils.addCarriageReturns(contents.toString());
        }
        return connection.uploadDataset(contents, "'" + dataset + "'", transferType);
    }

    /**
     * Save the file to disk before watch
     */
    private static save(name: string, contents: string | Buffer, ext = "txt", path = ""): string {
        // Construct the full filepath
        const file: string = join(path, name + "." + ext);

        // Save the file
        IO.createFileSync(file);
        IO.writeFile(file, Buffer.from(contents as string));

        // Return the filename
        return file;
    }
}

