import express from "express"

import cors from "cors"

import Router from "./routes/index.js"
import { User, Account } from "./db.js"
import { connectDB } from "./dbconnect.js"
import accountrouter from "./routes/accounts.js"
import dotenv from "dotenv";

dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());


await connectDB(); // Connect to MongoDB before server starts




console.log("✅ Mounting /api/v1 routes...");
app.use("/api/v1",Router);

app.get("/", (req, res) => {
  res.send("✅ Server is up and running!");
});


app.listen(3000);