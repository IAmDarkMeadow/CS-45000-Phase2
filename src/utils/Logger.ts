/*
 * debloatService.ts
 *
 * 
 * Description:
 * This file provides a pre-configured logger instance using the `winston` library
 * for structured logging in your application. It supports logging to a file with
 * customizable options and uses environment variables to set the log file location.
 * 
 * Author: Grayson DeHerdt
 * Date: 12-8-2024
 * Version: 1.0
 * 
 */




import { createLogger, format, transports } from 'winston';
import * as dotenv from 'dotenv';

dotenv.config();

const logPath = process.env.LOG_FILE || './default.log';

const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp(),
        format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level}]: ${message}`;
        })
    ),
    transports: [
        new transports.File({ filename: logPath, options: { flags: 'a' } })
    ],
});

export default logger;

