// src/utils/detectEnvironment.ts
import * as os from 'os';

export function detectEnvironment(): { [key: string]: any } {
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
