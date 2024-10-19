// logger.js
const { createLogger, format, transports } = require('winston');
const path = require('path');

// Define the custom logging format
const logFormat = format.printf(({ timestamp, level, message }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create the logger instance
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }), // Log stack traces for errors
        format.splat(), // Allow string interpolation in logs
        logFormat
    ),
    transports: [
        // Log errors to a file in the 'logs' directory
        new transports.File({ 
            filename: path.join(__dirname, 'logs', 'error.log'), 
            level: 'error'
        }),
        // Log all activities to a combined log file
        new transports.File({ 
            filename: path.join(__dirname, 'logs', 'combined.log')
        })
    ]
});

// If not in production, log to the console
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(), // Colorize the output for easier reading
            format.simple()
        )
    }));
}

module.exports = logger;
