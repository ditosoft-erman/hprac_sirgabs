import express from "express";
import authRoutes from "./routes/authRoutes";

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use("/auth", authRoutes);
  return app;
};

export default createApp;
