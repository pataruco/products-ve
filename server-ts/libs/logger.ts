// Copy/pasta from winston docs
import winston from 'winston';
const { createLogger, format, transports } = winston;
const { combine, timestamp, prettyPrint, json, colorize } = format;

type Service = 'SERVER' | 'DATABASE';

interface TypeOfService {
  service: Service;
}

// Taken from https://github.com/winstonjs/winston#creating-custom-formats
const addServiceLabel = format(
  (info, { service = 'SERVER' }: TypeOfService) => {
    return { ...info, service };
  },
);

const logger = createLogger({
  format: combine(
    addServiceLabel(),
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
