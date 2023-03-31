// Copy/pasta from winston docs
import winston from 'winston';
const { createLogger, format, transports } = winston;
const { combine, timestamp, prettyPrint, json, colorize, label } = format;

export enum Tag {
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
    label({
      label: 'SERVICE',
      message: false,
    }),
  ),
  transports: [new transports.Console()],
  exitOnError: false,
});

export default logger;
