const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(__dirname, '../../logs');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  formatMessage(level, message, meta = {}) {
    const timestamp = new Date().toISOString();
    const metaStr = Object.keys(meta).length ? JSON.stringify(meta) : '';
    return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaStr}\n`;
  }

  writeToFile(level, message, meta) {
    const logFile = path.join(this.logDir, `${level}.log`);
    const formattedMessage = this.formatMessage(level, message, meta);
    
    fs.appendFile(logFile, formattedMessage, (err) => {
      if (err) console.error('Failed to write to log file:', err);
    });

    // Also write to combined log
    const combinedLogFile = path.join(this.logDir, 'combined.log');
    fs.appendFile(combinedLogFile, formattedMessage, (err) => {
      if (err) console.error('Failed to write to combined log file:', err);
    });
  }

  info(message, meta = {}) {
    console.log(`ℹ️  ${message}`, meta);
    this.writeToFile('info', message, meta);
  }

  error(message, meta = {}) {
    console.error(`❌ ${message}`, meta);
    this.writeToFile('error', message, meta);
  }

  warn(message, meta = {}) {
    console.warn(`⚠️  ${message}`, meta);
    this.writeToFile('warn', message, meta);
  }

  debug(message, meta = {}) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`🐛 ${message}`, meta);
      this.writeToFile('debug', message, meta);
    }
  }

  success(message, meta = {}) {
    console.log(`✅ ${message}`, meta);
    this.writeToFile('info', message, meta);
  }
}

module.exports = new Logger();