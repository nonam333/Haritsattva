import "dotenv/config";
import { app } from "./app";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

(async () => {
  const server = await registerRoutes(app);

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "development") {
    log("Starting in development mode with Vite");
    await setupVite(app, server);
  } else {
    log("Starting in production mode");
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  const port = parseInt(process.env.PORT || '5000', 10);

  // FIX: Bind to 0.0.0.0 so Render can access the server
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
    log(`Open http://0.0.0.0:${port} in your browser`);
  });
})();