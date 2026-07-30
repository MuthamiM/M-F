// src/server.ts
import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";

const app = createApp();

const server = app.listen(env.PORT, () => {
  logger.info(`M&F Technologies API listening on port ${env.PORT} [${env.NODE_ENV}]`);
});

// Graceful shutdown — let in-flight requests finish before exiting,
// so a deploy/restart doesn't drop live traffic.
function shutdown(signal: string) {
  logger.info(`${signal} received, shutting down gracefully`);
  server.close(() => {
    logger.info("HTTP server closed");
    process.exit(0);
  });

  // Force-exit if something hangs
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// Never let an unexpected error crash the process silently
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled promise rejection", { reason });
});
process.on("uncaughtException", (err) => {
  logger.error("Uncaught exception", { message: err.message, stack: err.stack });
  process.exit(1);
});
