import express from "express";
import { z } from "zod";
// import JWT_SECRET from "../config.js";

import { User } from "../db.js";
import jwt from 'jsonwebtoken';
import authMiddleware from "../middleware.js";
import { Account } from "../db.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;



const userRouter = express.Router();


const signupBody = z.object({
    username: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    password: z.string(),
})

userRouter.post("/signup", async (req, res) => {
    const body = req.body;


    const { success } = signupBody.safeParse(req.body)
    if (!success) {
        return res.status(411).json({
            message: "invalid input format"
        });
    }



    const existingUser = await User.findOne({
        username: body.username,
    });
    if (existingUser) {
        return res.status(411).json({
            message: "Email already taken/incorrect inputs",
        });

    }

    const user1 = await User.create({
        username: body.username,
        password: body.password,
        firstName: body.firstName,
        lastName: body.lastName
    })


        await Account.create({
        userId: user1._id,
        balance: Math.floor(1 + Math.random() * 10000)
    });



    const token = jwt.sign(
        {
            userid: user1._id,
        },
        JWT_SECRET

    );
    res.json({
        message: "User created succesfully",
        token: token,
    });

});

const signinBody = z.object({
    username: z.string().email(),
    password: z.string()


})
userRouter.post("/signin", async (req, res) => {

    const body = req.body;


    const { success } = signinBody.safeParse(body)
    if (!success) {
        return res.status(411).json({
            message: "Invalid email or password format"
        });
    }

    const user = await User.findOne({
        username: body.username,
        password: body.password
    });

    if (user) {
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);

        res.json({
            token: token
        })
        return;
    }


    res.status(411).json({
        message: "invalid username or password",
    })
})





// other auth routes

const updateBody = z.object({
    password: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),
})

userRouter.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body)
    if (!success) {
        res.status(411).json({
            message: "Error while updating information"
        })
    }

    await User.updateOne({ _id: req.userId }, req.body);

    res.json({
        message: "Updated successfully"
    })
})





userRouter.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})





















export default userRouter;
