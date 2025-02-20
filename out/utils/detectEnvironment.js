"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectEnvironment = void 0;
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
const os = require("os");
function detectEnvironment() {
    return {
        platform: os.platform(),
        arch: os.arch(),
        release: os.release(),
        nodeVersion: process.version,
        homeDir: os.homedir(),
        cwd: process.cwd(),
        cpuCount: os.cpus().length,
        totalMemory: os.totalmem(),
        freeMemory: os.freemem()
    };
}
exports.detectEnvironment = detectEnvironment;
//# sourceMappingURL=detectEnvironment.js.map