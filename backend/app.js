import express from "express";

import morgan from "morgan";
import connect from "./db/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import userRoutes from "./routes/user.routes.js";
import projectRoutes from "./routes/project.routes.js";
import aiRoutes from "./routes/ai.routes.js";

connect();

const app = express();

app.use(morgan(`dev`));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);
app.use("/project", projectRoutes);
app.use("/ai", aiRoutes);

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Using  Realtime MERN Chat APP");
});

export default app;
