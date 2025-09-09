import express from "express";
import dotenv from "dotenv";
import productRoutes from "./routes/product.routes";
import connectDB from "./config/db";
import errorHandler from "./middlewares/errorHandler";
import notFoundHandler from "./middlewares/notFoundHandler";

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

app.use("/api/products", productRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
