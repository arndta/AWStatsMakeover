  
module.exports = function (debug) {
    const winston = require('winston');
    const dateformat = require("dateformat");
    const fs = require("fs");
    
    const today = new Date();
    const logDir = './logs';
    
    if (!fs.existsSync(logDir)){
        fs.mkdirSync(logDir);
    }
    
    const logger = winston.createLogger({
        level: debug ? 'debug' : 'info',
        format: winston.format.simple(),
        transports: [
          new winston.transports.File({ filename: `${logDir}/${dateformat(today, "yyyymmdd")}.error.log`, level: 'error' }),
          new winston.transports.File({ filename: `${logDir}/${dateformat(today, "yyyymmdd")}.combined.log` }),
          new winston.transports.Console({ format: winston.format.colorize() })
        ]
      });    

    return {
        'logger': logger   
    }
};