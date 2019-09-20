import log4js from 'log4js';
log4js.configure({
  appenders: { log: { type: 'file', filename: 'log/log.log' } },
  categories: { default: { appenders: ['log'], level: 'debug' } }
});
const logger = log4js.getLogger('log');

export default logger;
