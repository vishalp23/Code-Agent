"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectEnvironment = void 0;
// src/utils/detectEnvironment.ts
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