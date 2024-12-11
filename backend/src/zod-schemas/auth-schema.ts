import z from "zod";

export const signupSchema = z.object({
    name:z.string().min(3,"enter name (more than 3 length)"),
    lastName:z.string().min(3,"enter name (more than 3 length)"),
    email:z.string().email("invalid email address"),
    password:z.string().min(6, "please enter password of length 6")
})

export const signInSchema = z.object({
    email:z.string().email("pls enter a valid email"),
    password:z.string()
})