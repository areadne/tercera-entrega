import winston from "winston";
import config from "../config/config.js";

const environment = config.ambiente.env

const createLogger = (environment) => {
  if (environment === "PROD") {
    return winston.createLogger({
      levels: {
          error: 0,
          fatal: 1,
          info: 2,
          warning: 3,
          debug: 4,
          http: 5,
      },
      transports: [
        new winston.transports.Console({
            filename: "./logs/serverlogs.log",
            level: "warning",
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.simple()
            ),
          }),
        new winston.transports.File({
          filename: "./logs/serverlogs.log",
          level: "fatal",
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple()
          ),
        }),
      ],
    });
  } else if (environment === "DEV") {
    return winston.createLogger({
      levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5
      },
      transports: [
        new winston.transports.Console({
          level: "fatal",
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.simple()
          ),
        }),
      ],
    });
  }
};

const logger = createLogger(environment)

export default logger;
