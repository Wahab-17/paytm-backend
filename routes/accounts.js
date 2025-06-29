import express from "express";

import authMiddleware from "../middleware.js";
import { Account } from "../db.js";
import  mongoose  from "mongoose";
const accountrouter = express.Router();
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

// accountrouter.post("/transfer", authMiddleware, async (req, res) => {
//     const { amount, to } = req.body;

//     try {
//         const fromAccount = await Account.findOne({ userId: req.userId });

//         if (!fromAccount || fromAccount.balance < amount) {
//             return res.status(400).json({ message: "Insufficient balance or account not found" });
//         }

//         const toAccount = await Account.findOne({ userId: to });

//         if (!toAccount) {
//             return res.status(400).json({ message: "Recipient account not found" });
//         }

//         // Deduct from sender
//         fromAccount.balance -= amount;
//         await fromAccount.save();

//         // Add to recipient
//         toAccount.balance += amount;
//         await toAccount.save();

//         res.json({ message: "Transfer Successful" });
//     } catch (e) {
//         console.error("Transfer Error:", e);
//         res.status(500).json({ message: "Transfer Failed", error: e.message });
//     }
// });
// accountrouter.post("/transfer", authMiddleware, async (req, res) => {
//   let { amount, to } = req.body;

//   // Convert amount to number (safely)
//   amount = Number(amount);

//   if (!amount || isNaN(amount) || amount <= 0) {
//     return res.status(400).json({ message: "Invalid amount entered" });
//   }

//   try {
//     const fromAccount = await Account.findOne({ userId: req.userId });

//     if (!fromAccount || fromAccount.balance < amount) {
//       return res.status(400).json({ message: "Insufficient balance or account not found" });
//     }

//     const toAccount = await Account.findOne({ userId: to });

//     if (!toAccount) {
//       return res.status(400).json({ message: "Recipient account not found" });
//     }

//     // Perform transfer
//     fromAccount.balance -= amount;
//     toAccount.balance += amount;

//     // Save both accounts
//     await fromAccount.save();
//     await toAccount.save();

//     res.json({ message: "Transfer Successful" });
//   } catch (e) {
//     console.error("Transfer Error:", e);
//     res.status(500).json({ message: "Transfer Failed", error: e.message });
//   }
// });


export default accountrouter;

//import mongoose from "mongoose";

// accountrouter.post("/transfer", authMiddleware, async (req, res) => {
//   let { amount, to } = req.body;

//   // Convert amount to number
//   amount = Number(amount);
//   if (!amount || isNaN(amount) || amount <= 0) {
//     return res.status(400).json({ message: "Invalid amount entered" });
//   }

//   try {
//     const fromAccount = await Account.findOne({ 
//       userId: new mongoose.Types.ObjectId(req.userId) 
//     });

//     const toAccount = await Account.findOne({ 
//       userId: new mongoose.Types.ObjectId(to) 
//     });

//     if (!fromAccount || fromAccount.balance < amount) {
//       return res.status(400).json({ message: "Insufficient balance or account not found" });
//     }

//     if (!toAccount) {
//       return res.status(400).json({ message: "Recipient account not found" });
//     }

//     // Perform transfer
//     fromAccount.balance -= amount;
//     toAccount.balance += amount;

//     await fromAccount.save();
//     await toAccount.save();

//     res.json({ message: "Transfer Successful" });
//   } catch (e) {
//     console.error("Transfer Error:", e);
//     res.status(500).json({ message: "Transfer Failed", error: e.message });
//   }
// });

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

    res.json({ message: "Transfer Successful" });
  } catch (e) {
    console.error("Transfer Error:", e);
    res.status(500).json({ message: "Transfer Failed", error: e.message });
  }
});

