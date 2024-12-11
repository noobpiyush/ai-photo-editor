import express from "express";
import { rootRouter } from "./routes/routes";

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/health", async (_,res) => {
    res.send("hii there from the server")
})

console.log("server started 😀");

app.use("/api/v1",rootRouter);


app.listen(PORT);