// Copy/pasta from winston docs
import winston from 'winston';
const { createLogger, format, transports } = winston;
const { combine, timestamp, prettyPrint, json, colorize } = format;

export enum Service {
  SERVER = 'SERVER',
  DATABASE = 'DATABASE',
}

const logger = createLogger({
  format: combine(
    timestamp(),
    prettyPrint(),
    json(),
    colorize({
      all: true,
    }),
  ),
  transports: [new transports.Console()],
  exitOnError: false,
});

export default logger;
