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

const Readable = require("stream").Readable;

export default class TestUtils {

    public static getSingleLineStream() {
        const stream = new Readable();
        stream.push("Hello world");
        stream.push(null);
        return stream;
    }

    public static getMockResponse() {
        return {
            progress: {
                startBar: jest.fn(),
                endBar: jest.fn()
            },
            data: {
                setMessage: jest.fn(),
                setObj: jest.fn()
            },
            console: {
                log: jest.fn()
            },
            format: {
                output: jest.fn()
            }
        };
    }
}

