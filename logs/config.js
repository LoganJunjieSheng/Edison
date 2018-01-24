const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const myFormat = printf(info => {
	return `${info.timestamp} ${info.level}: ${info.message}`;
});
var logger = createLogger({  
	format: combine(
    	timestamp(),
    	myFormat
	),
    transports: [  
        new transports.Console(),  
        new transports.File({  
			level:'error',
            filename:__dirname+ '/error.log',}),
        new transports.File({
            level:'warn',
            filename:__dirname+ '/warn.log',}),
        new transports.File({
            level:'info',
            filename:__dirname+ '/info.log',}),
 
    ]});  
  
exports.logger=logger;  

