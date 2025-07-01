import express from "express";

import authMiddleware from "../middleware.js";
import { Account } from "../db.js";
import { Transaction } from "../db.js";
import  mongoose  from "mongoose";
const accountrouter = express.Router();
console.log("✅ accounts.js router loaded");

accountrouter.get("/balance", authMiddleware, async (req, res) => {
    const account = await Account.findOne({
        userId: req.userId
    });

    if (!account) {
        return res.status(404).json({ message: "Account not found" });
    }

    res.json({
        balance: account.balance
    });
});






accountrouter.post("/transfer", authMiddleware, async (req, res) => {
  let { amount, to } = req.body;

  amount = Number(amount);
  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ message: "Invalid amount entered" });
  }

  try {
    const fromAccount = await Account.findOne({ userId: req.userId });
    const toAccount = await Account.findOne({ userId: to });

    if (!fromAccount || fromAccount.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance or account not found" });
    }

    if (!toAccount) {
      return res.status(400).json({ message: "Recipient account not found" });
    }

    fromAccount.balance -= amount;
    toAccount.balance += amount;

    await fromAccount.save();
    await toAccount.save();

    await Transaction.create({
  from: req.userId,
  to,
  amount
});
  res.json({ message: "Transfer Successful" });
  } catch (e) {
    console.error("Transfer Error:", e);
    res.status(500).json({ message: "Transfer Failed", error: e.message });
  }
});

accountrouter.get("/transactions", authMiddleware, async (req, res) => {
  console.log("✅ /transactions route HIT by user:", req.userId);
  try {
    const transactions = await Transaction.find({
      $or: [{ from: req.userId }, { to: req.userId }]
    })
      .sort({ timestamp: -1 })
      .populate("from", "firstName lastName")
      .populate("to", "firstName lastName");

    console.log("✅ Found", transactions.length, "transactions");
    res.json({ transactions });
  } catch (e) {
    console.error("❌ Error fetching transactions:", e.message);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});

export default accountrouter;