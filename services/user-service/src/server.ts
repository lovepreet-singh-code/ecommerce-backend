import app from "./app";
import { config } from "./config";
import { connectMongo } from "./db/mongo";

const start = async () => {
  await connectMongo();

  app.listen(config.port, () => {
    console.log(`🚀 User-Service running on port ${config.port}`);
  });
};

start();
