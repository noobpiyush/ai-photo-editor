import express from "express";
import { authRouter } from "./auth-route/auth";

export const rootRouter = express.Router();

rootRouter.use("/auth",authRouter);