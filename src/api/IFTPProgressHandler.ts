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

export interface IFTPProgressHandler {

    /**
     * Starts a FTP task with the total work size.
     *
     * @param total - total work size
     */
    start(total: number, message?: string): void;

    /**
     * Updates how much work is performed, so that the class implementing this interface can update progress bar for example.
     *
     * @param work - how much work is performed
     */
    worked(work: number, message?: string): void;

    /**
     * The FTP task ends, either all work is completed or any error happens.
     */
    end(): void;
}
