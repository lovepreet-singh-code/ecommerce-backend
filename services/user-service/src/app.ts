import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

// Routes
app.use("/api", routes);

// Healthcheck
app.get("/health", (_, res) => {
  res.json({ status: "ok", service: "user-service" });
});

// 404 Handler
app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global Error Handler
app.use(errorHandler);

export default app;
