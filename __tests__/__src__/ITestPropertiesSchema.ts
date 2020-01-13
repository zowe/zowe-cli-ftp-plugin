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

/**
 * Interface representing the values in the custom_properties.yaml file
 * see example_properties.yaml for descriptions and more details
 */
export interface ITestPropertiesSchema {

    /**
     * Properties related to basic zos-ftp (zos-node-accessor package) connection
     * see bright profiles create zftp --help for more info
     */
    zosftp: {
        /**
         * user ID to connect to FTP with
         */
        user: string,
        /**
         * Password to connect to FTP with
         */
        password: string,
        /**
         * host name for FTP
         */
        host: string,
        /**
         * Port for FTP connection
         */
        port?: number,
        /**
         * See zos-node-accessor doc - specification for secure FTP transfer
         */
        secureFtp?: string,
        /**
         * How long to wait after attempting to connect before FTP connection times out
         */
        connectionTimeout?: number
        /**
         * Local file containing a job card for submitting jobs for commands such as
         * create data set
         */
        jobCardFile: string;
    };
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
    };
    jobs: {

        /**
         * a PDS member containing IEFBR14 JCL that your user ID can submit
         */
        iefbr14Member: string,
    };
    uss: {
        /**
         * Directory on USS on the system where files can be written, moved, deleted
         */
        ussTestDirectory: string;
    }
}
