export interface ILogger {
  log(message: string, data?: string | Record<string, any>): void;
  error(message: string, data?: string | Record<string, any>): void;
  warn(message: string, data?: string | Record<string, any>): void;
  debug(message: string, data?: string | Record<string, any>): void;
}

export type LoggerFactory = {
  create(context: string): ILogger;
};
