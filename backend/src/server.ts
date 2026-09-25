// src/server.ts
import { createApp } from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { ticketStore } from "./features/tickets/tickets.store";

(async function start() {
  // Attempt to load persisted tickets from Redis before accepting traffic
  try {
    await ticketStore.initFromPersistence();
  } catch (err) {
    // continue even if persistence init fails
  }

  // Auto-restore any files from uploads directory into PostgreSQL database
  try {
    const { restoreUploadedFilesFromDisk } = await import("./features/uploads/uploads.service");
    const path = await import("path");
    await restoreUploadedFilesFromDisk(path.join(process.cwd(), "uploads"));
  } catch (err: any) {
    logger.warn(`Uploads auto-restore notice: ${err?.message}`);
  }

  const app = createApp();

  function listen() {
    const server = app.listen(env.PORT, () => {
      logger.info(`M&F Technologies API listening on port ${env.PORT} [${env.NODE_ENV}]`);
    });

    server.on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        logger.warn(`Port ${env.PORT} busy, retrying in 500ms...`);
        setTimeout(() => {
          listen();
        }, 500);
      } else {
        logger.error(`Server error: ${err.message}`);
      }
    });

    // Graceful shutdown
    function shutdown(signal: string) {
      logger.info(`${signal} received — shutting down gracefully`);
      if ("closeAllConnections" in server) {
        (server as any).closeAllConnections();
      }
      server.close(() => {
        logger.info("Server closed");
        process.exit(0);
      });
      setTimeout(() => {
        logger.error("Forced shutdown after timeout");
        process.exit(1);
      }, 2_000);
    }

    process.once("SIGTERM", () => shutdown("SIGTERM"));
    process.once("SIGINT", () => shutdown("SIGINT"));
  }

  listen();
})();
