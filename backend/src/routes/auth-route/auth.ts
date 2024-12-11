import express from "express";
import { signInSchema, signupSchema } from "../../zod-schemas/auth-schema";
import prisma from "../../db/prisma";

import jwt from "jsonwebtoken"
export const authRouter = express.Router();

export const JWT_SECRET = process.env.JWT_SECRET as string || "piyush123";

authRouter.post("/signup", async (req, res) => {
    try {
        const result = signupSchema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({ error: result.error.issues });
            return;
        }

        const {name,lastName,email,password} = result.data;

        let user;

        try {
          user = await prisma.user.create({
                data:{
                    name,
                    fullName:lastName,
                    email,
                    password
                }
            })
        } catch (error) {
            console.log("error while inserting user to db" , error);
            res.status(500).send("error while creating the user");
            return;
        }

        const token = jwt.sign({
            id:user.id,
            email:user.email
        },JWT_SECRET);

        res.status(200).json({
            msg:"user created successfully",
            id:user.id,
            token
        });

        return;

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
});

authRouter.post("/signin", async (req,res)=>{
    try {
        const result = signInSchema.safeParse(req.body);

        if (!result.success) {
            res.status(400).json({ error: result.error.issues });
            return;
        }

        const {email, password} = result.data;
        
        let user;

        try {
            user = await prisma.user.findUnique({
                where:{
                    email
                }
            });

            if (!user) {
                res.status(404).json({ error: "User not found" });
                return;
            }
        } catch (error) {
            console.log("error while signinup", error);
            res.status(500).send("error while signing up")
        }

        if (user?.password != password) {
            res.status(404).json({ error: "please enter valid password" });
            return;
        }

        const token = jwt.sign({
            id:user.id,
            email:user.email
        },JWT_SECRET);

        res.status(200).json({
            token,
            msg:"user signed in successfully"
        });

        return;

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ error: "Internal server error" });
        return;
    }
})