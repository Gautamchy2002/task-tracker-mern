import "dotenv/config";
import app from "./app.js";

const port = Number(process.env.PORT) || 5000;

const server = app.listen(port, () => {
  console.log("==========================================");
  console.log("Task Tracker Backend Started");
  console.log(`Server URL: http://localhost:${port}`);
  console.log(`Health API: http://localhost:${port}/api/health`);
  console.log("==========================================");
});

/*
 * Graceful shutdown:
 * Server close karte waqt existing connections properly terminate honge.
 */
const shutdown = (signal: string): void => {
  console.log(`\n${signal} received. Closing server...`);

  server.close(() => {
    console.log("Server closed successfully.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
