// server/app.js
import express from "express";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

// Import middlewares 
import { logRequest } from "./middleware/logging.js";
import { errorHandler } from "./middleware/errorHandler.js";

// Import routes 
import productRoutes from "./routes/products.js";

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/productdb");
mongoose.connection.once("open", () => {
  console.log("✅ Connected to MongoDB");
});

// MIDDLEWARES
app.use(express.json()); // parse JSON bodies
app.use(logRequest); // custom logging middleware (we'll build this)
app.use(express.static(path.join(__dirname, "../client"))); // serve frontend
app.use("/node_modules", express.static(path.join(__dirname, "../../node_modules"))); // serve dependencies

// ROUTES
app.use("/api/products", productRoutes);

// ERROR HANDLER
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
