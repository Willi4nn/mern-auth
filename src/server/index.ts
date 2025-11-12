import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import authRouter from "../routes/auth";
import passwordResetRouter from "../routes/passwordReset";
import userRouter from "../routes/users";
import connectToMongoDB from "./db";

const app = express();

config();

app.use(
  helmet({
    crossOriginOpenerPolicy: false,
  })
);
app.use(cookieParser());
app.use(express.json());

connectToMongoDB();

app.use(
  cors({
    origin: process.env.NODE_ENV === "production" || process.env.BASE_URL,
    credentials: true,
  })
);

app.use("/api/auth/", rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/password-reset", passwordResetRouter);

app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
  next();
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
