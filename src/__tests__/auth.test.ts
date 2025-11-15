import bcrypt from "bcryptjs";
import express from "express";
import jwt from "jsonwebtoken";
import request from "supertest";
import { User } from "../models/User";
import authRouter from "../routes/auth";
import userRouter from "../routes/users";

const app = express();
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

jest.mock("../utils/sendEmail", () => jest.fn());

process.env.JWT_SECRET = "test-secret-key";

describe("MERN Auth - General Authentication Tests", () => {
  it("should reject invalid user data", async () => {
    const res = await request(app).post("/api/users").send({
      username: "wi",
      email: "invalid",
      password: "123",
    });
    expect(res.status).toBe(400);
  });

  it("should create new user", async () => {
    const res = await request(app).post("/api/users").send({
      username: "willian",
      email: "willian@gmail.com",
      password: "password123",
    });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  it("should reject duplicate email", async () => {
    await User.create({
      username: "willian",
      email: "duplicate@gmail.com",
      password: "password123",
    });

    const res = await request(app).post("/api/users").send({
      username: "willian",
      email: "duplicate@gmail.com",
      password: "password123",
    });
    expect(res.status).toBe(409);
  });

  it("should reject invalid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "nonexistent@gmail.com",
      password: "wrongpassword",
    });
    expect(res.status).toBe(401);
  });

  it("should reject unverified user login", async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    await User.create({
      username: "unverified",
      email: "unverified@gmail.com",
      password: hashedPassword,
      verified: false,
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "unverified@gmail.com",
      password: "password123",
    });
    expect(res.status).toBe(400);
  });

  it("should login successfully and return JWT", async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const user = await User.create({
      username: "verified",
      email: "verified@gmail.com",
      password: hashedPassword,
      verified: true,
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "verified@gmail.com",
      password: "password123",
    });

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.message).toBe("Logado com sucesso!");

    const decoded = jwt.verify(res.body.data, process.env.JWT_SECRET!) as { _id: string };
    expect(decoded._id).toBe(user._id.toString());
  });

  it("should hash user password", async () => {
    const salt = await bcrypt.genSalt(10);
    const plainPassword = "password123";
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const user = await User.create({
      username: "hashtest",
      email: "hashtest@gmail.com",
      password: hashedPassword,
      verified: true,
    });

    const userWithPassword = await User.findById(user._id).select("+password");
    expect(userWithPassword?.password).not.toBe(plainPassword);

    const isMatch = await bcrypt.compare(
      plainPassword,
      userWithPassword!.password
    );
    expect(isMatch).toBe(true);
  });

  it("should generate valid JWT token", async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("password123", salt);

    const user = await User.create({
      username: "jwttest",
      email: "jwttest@gmail.com",
      password: hashedPassword,
      verified: true,
    });

    const token = user.generateAuthToken();
    
    expect(token).toBeDefined();
    expect(typeof token).toBe("string");

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { _id: string };
    expect(decoded._id).toBe(user._id.toString());
  });
});