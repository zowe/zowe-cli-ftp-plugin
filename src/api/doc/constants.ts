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

import { TransferMode } from "zos-node-accessor";

/**
 * Bytes per track.
 */
export const TRACK = 56664;

/**
 * The data is transferred in text mode, in which encoding conversion like ASCII/EBCDIC will happen.
 */
export const TRANSFER_TYPE_ASCII = TransferMode.ASCII;

/**
 * The data is transferred in binary mode, in which no encoding conversion will happen.
 */
export const TRANSFER_TYPE_BINARY = TransferMode.BINARY;

/**
 * The data is transferred in text mode like TRANSFER_TYPE_ASCII, and 4-byte RDW is inserted at beginning of each record.
 */
export const TRANSFER_TYPE_ASCII_RDW = TransferMode.ASCII_RDW;
/**
  * The data is transferred in binary mode like TRANSFER_TYPE_BINARY, and 4-byte RDW is inserted at beginning of each record.
  */
export const TRANSFER_TYPE_BINARY_RDW = TransferMode.BINARY_RDW;