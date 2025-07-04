import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";

import { sequelize } from "./datasource.js";
import { authRouter } from "./routes/auth_router.js";
import { checkoutRouter } from "./routes/checkout_router.js";
import { webhookRouter } from "./routes/webhook_router.js";
import { queueRouter } from "./routes/queue_router.js";
import { registerIOListeners } from "./sockets/index.js";
import { isAuthSocket } from "./middlewares/auth.js";

const app = express();
const httpServer = http.createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:4200",
    credentials: true,
  },
});

// Socket authentication middleware
io.use(isAuthSocket);
registerIOListeners(io);

// Pass io to routers that need it
app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use(
  cors({
    origin: [process.env.FRONTEND_URL || "http://localhost:4200"],
    credentials: true,
  }),
);
app.use("/api/webhook", webhookRouter); // has to be before express.json() is applied
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

try {
  await sequelize.authenticate();
  await sequelize.sync({ alter: { drop: false } });
  console.log("Connection has been established successfully.");
} catch (error) {
  console.error("Unable to connect to the database:", error);
}

// Routes here
app.use("/api/auth", authRouter);
app.use("/api/checkout", checkoutRouter);
app.use("/api/queue", queueRouter);

const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => console.log("Server running"));
