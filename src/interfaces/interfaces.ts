/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
export interface SetupStep {
    cmd: string;
    message: string;
  }
  
  export interface SetupResult {
    steps: SetupStep[];
    finalProjectFolder: string;
    launchCommand: string;
    virtualEnv?: string;
  }