process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err.message);
  console.error("Stack:", err.stack);
});

process.on("unhandledRejection", (reason: any) => {
  console.error("UNHANDLED REJECTION:", reason?.message || reason);
});

import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js"
import { initializedSocket } from "./socket/socket.js"; 

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes)

app.get("/", (req,res) => {
    res.send("Server is running");
})

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

//listen to socket events
console.log("JWT_SECRET =", process.env.JWT_SECRET);

try {
  initializedSocket(server);
  console.log("Socket.IO initialized successfully");
} catch (error: any) {
  console.error("Failed to initialize Socket.IO:", error.message);
  process.exit(1);
}

connectDB().then(() => {
    console.log("Database Connected")
    server.listen(PORT, () => {
        console.log("Server is running on port", PORT);
    });
}).catch((error) => {
    console.error("Failed to start the server due to database connection error:", error.message);
    process.exit(1);
});