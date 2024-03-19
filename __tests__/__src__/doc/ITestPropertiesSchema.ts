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

import { ICommandArguments } from "@zowe/imperative";

/**
 * Interface representing the values in the custom_properties.yaml file
 * see example_properties.yaml for descriptions and more details
 */
export interface ITestPropertiesSchema {

    /**
     * Properties related to basic zos-ftp (zos-node-accessor package) connection
     * see zowe profiles create zftp --help for more info
     */
    zftp: ICommandArguments;
    datasets: {
        /**
         * A PDS (partitioned data set) that new members can be written to
         * during automated tests
         */
        writablePDS: string;
        /**
         * A PDS (partitioned data set) that can be renamed.
         * If tests passed, it should be renamed to the original name
         * that you specify in custom_properties
         */
        renamablePDS: string;
        /**
         * Data set name prefix
         */
        dsnPrefix: string;
        /**
         * LoadLib dataset name
         */
        dsnLoadLib:string;
    };
    jobs: {

        /**
         * a PDS member containing IEFBR14 JCL that your user ID can submit
         */
        iefbr14Member: string,
        sleepMember: string;
    };
    uss: {
        /**
         * Directory on USS on the system where files can be written, moved, deleted
         */
        ussTestDirectory: string;

        /**
         * Symbolic link of ussTestDirectory, created with "ln -s <ussTestDirectory> <ussTestDirectoryLink>"
         */
        ussTestDirectoryLink: string;
    }
}
