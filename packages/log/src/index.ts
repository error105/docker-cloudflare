import {
  createLogger as createWinstonLogger,
  format,
  transports
} from "winston";

import type { Logger } from "winston";

export const createLogger = (level: string): Logger => {
  const option = {
    level,
    transports: [new transports.Console()],
    format: format.combine(
      format.timestamp(),
      format.printf(
        ({ timestamp, level, message }) => `${timestamp} [${level}] ${message}`
      )
    )
  };
  return createWinstonLogger(option);
};

export { Logger } from "winston";
