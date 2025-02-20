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