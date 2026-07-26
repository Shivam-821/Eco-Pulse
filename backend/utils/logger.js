import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the logs directory at the backend root (two levels up from utils/)
const LOG_DIR = path.join(__dirname, "..", "logs");
const ERROR_LOG = path.join(LOG_DIR, "error.log");
const COMBINED_LOG = path.join(LOG_DIR, "combined.log");

// Create logs directory if it doesn't exist
if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

const isDev = process.env.NODE_ENV !== "production";

/**
 * Formats a log entry as a single JSON line.
 * Each line: { timestamp, level, message, ...meta }
 */
function formatEntry(level, message, meta = {}) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message: typeof message === "string" ? message : JSON.stringify(message),
    ...meta,
  };
  return JSON.stringify(entry) + "\n";
}

/**
 * Appends a log entry to a file (non-blocking, fire-and-forget).
 * If the write fails we silently ignore it — the server must never crash
 * because of a logging failure.
 */
function appendToFile(filepath, line) {
  fs.appendFile(filepath, line, (err) => {
    if (err && isDev) {
      process.stderr.write(`[Logger] Failed to write log: ${err.message}\n`);
    }
  });
}

const logger = {
  /**
   * Informational messages (startup, DB connected, cron ticks, worker events, etc.)
   */
  info(message, meta = {}) {
    const line = formatEntry("INFO", message, meta);
    appendToFile(COMBINED_LOG, line);
    if (isDev) process.stdout.write(`[INFO]  ${message}\n`);
  },

  /**
   * Non-critical warnings (API retry attempts, fallback paths taken, etc.)
   */
  warn(message, meta = {}) {
    const line = formatEntry("WARN", message, meta);
    appendToFile(COMBINED_LOG, line);
    if (isDev) process.stderr.write(`[WARN]  ${message}\n`);
  },

  /**
   * Errors that need attention (failed DB calls, Twilio failures, AI errors, etc.)
   * Writes to BOTH error.log AND combined.log.
   */
  error(message, meta = {}) {
    // Serialize Error objects properly
    if (meta instanceof Error) {
      meta = { errorMessage: meta.message, stack: meta.stack };
    }
    const line = formatEntry("ERROR", message, meta);
    appendToFile(ERROR_LOG, line);
    appendToFile(COMBINED_LOG, line);
    if (isDev) process.stderr.write(`[ERROR] ${message}\n`);
  },
};

export default logger;
