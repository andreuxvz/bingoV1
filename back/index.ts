import express, { Request, Response, Express } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bingoRouter from "./routes/BingoRouter";
import gameRouter from "./routes/GameRouter";
import cors from "cors";

dotenv.config();
const app: Express = express();
const port: string | undefined = process.env.PORT;

//configure mongoose
console.log(`${process.env.MONGO_URI}/${process.env.MONGO_BD}`);
mongoose
  .connect(`${process.env.MONGO_URI}/${process.env.MONGO_BD}`)
  .then(() => console.log("Connected!"));

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    preflightContinue: false,
  })
);
app.use("/api/bingos", bingoRouter);
app.use("/api/games", gameRouter);
app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Serve3");
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default app;
