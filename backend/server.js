import http from "http";
import app from "./app.js";
import "dotenv/config.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import projectModel from "./models/project.model.js";
import { generateResult } from "./services/ai.service.js";

const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];

    console.log("token", token);
    if (!token) {
      return next(new Error("Authentication error"));
    }

    console.log("token2", token);

    const projectId = socket.handshake.query.projectId;

    console.log("projectId", projectId);

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("Invalid projectId"));
    }

    socket.project = await projectModel.findById(projectId);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next(new Error("Authentication error"));
    }

    socket.user = decoded;

    next();
  } catch (error) {
    next(error);
  }
});
io.on("connection", (socket) => {
  socket.roomId = socket.project._id.toString();

  socket.join(socket.roomId);

  socket.on("project-message", async (data) => {
    console.log("data", data);
    const message = data.message;

    const aiIsPresentInMessage = message.includes("@ai");
    socket.broadcast.to(socket.roomId).emit("project-message", data);

    if (aiIsPresentInMessage) {
      const prompt = message.replace("@ai", "");

      console.log("prompt", prompt);

      const result = await generateResult(prompt);

      console.log("result", result);

      io.to(socket.roomId).emit("project-message", {
        message: result,
        sender: "AI",
      });

      return;
    }
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.leave(socket.roomId);
  });
});

server.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
