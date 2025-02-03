import mongoose from "mongoose";
import "dotenv/config.js";

function connect() {
  console.log("process.env.MONGO_URI", process.env.MONGO_URI);
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("connected to MongoDB");
    })
    .catch((err) => {
      console.log("error connecting to MongoDB", err);
    });
}

export default connect;
