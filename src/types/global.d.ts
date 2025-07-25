interface ProcessEnv {
  [key: string]: string | undefined;
}
declare namespace NodeJS {
  interface Process {
    env: ProcessEnv;
  }
}
declare var process: NodeJS.Process;
