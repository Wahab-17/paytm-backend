import express from "express";
import userRouter from "./user.js ";
import accountrouter from "./accounts.js";

const Router = express.Router();

console.log("✅ Mounting /user routes...");

Router.use("/user",userRouter);



console.log("✅ Mounting /account routes...");
Router.use("/account",accountrouter);







export default Router;