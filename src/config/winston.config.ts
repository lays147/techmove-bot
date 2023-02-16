import {
  utilities as nestWinstonModuleUtilities,
  WinstonModuleOptions,
} from 'nest-winston';
import * as winston from 'winston';

const timestamp = winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' });
const formatOptions =
  process.env.NODE_ENV != 'production'
    ? {
        level: 'verbose',
        format: winston.format.combine(
          timestamp,
          nestWinstonModuleUtilities.format.nestLike(),
        ),
      }
    : {
        level: 'info',
        format: winston.format.combine(
          timestamp,
          winston.format.errors({ stack: false }),
          winston.format.splat(),
          winston.format.json(),
        ),
      };

export const winstonConfig: WinstonModuleOptions = {
  exitOnError: false,
  levels: winston.config.npm.levels,
  level: formatOptions.level,
  format: formatOptions.format,
  defaultMeta: { service: 'connecta-salesforce' },
  transports: [new winston.transports.Console()],
};
