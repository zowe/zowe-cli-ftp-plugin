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

import { ICommandHandler, IHandlerParameters, ImperativeError, Logger } from "@zowe/imperative";
import { IFTPHandlerParams } from "./IFTPHandlerParams";
import { FTPConfig } from "./api/FTPConfig";
import { IZosFTPProfile } from "./api/doc/IZosFTPProfile";

/**
 * This class is used by the various zos-ftp handlers as the base class for their implementation.
 * All handlers within zos-ftp should extend this class.
 *
 */
export abstract class FTPBaseHandler implements ICommandHandler {
    /**
     * This will grab the zos-ftp profile and create a connection before calling the subclass
     *
     * @param commandParameters Command parameters sent by imperative.
     *
     */
    public async process(commandParameters: IHandlerParameters) {
        const profile = commandParameters.profiles.get("zftp");

        this.log.debug("Loaded zftp profile called '%s', attempting to connect to zos-node-accessor (FTP)",
            profile.name);
        let connection: any;
        try {
            connection = await FTPConfig.connectFromProfile(profile);
            this.log.info("Connected to FTP successfully");
            const additionalParameters: IFTPHandlerParams = commandParameters as IFTPHandlerParams;
            additionalParameters.connection = connection;
            additionalParameters.zosFtpProfile = profile as IZosFTPProfile;
            await this.processFTP(additionalParameters);
        } catch (e) {
            this.log.error("Error encountered in FTP command:\n%s", require("util").inspect(e));
            throw new ImperativeError({msg: e.message, causeErrors: [e]});
        } finally {
            // close the connection whether we saw an error or not
            if (connection != null) {
                this.log.debug("Closing FTP connection");
                connection.close();
            }
        }
    }

    /**
     * This is called by the subclass handlers after creating a connection. Should
     * be used so that every class under files does not have to instantiate the session object.
     *
     * @param  additionalParameters Extended parameters built during the process method including connection
     *
     * @returns  The response from the  create data set api call.
     */
    public abstract async processFTP(
        additionalParameters: IFTPHandlerParams
    ): Promise<void>;

    protected get log(): Logger {
        return Logger.getAppLogger();
    }
}
