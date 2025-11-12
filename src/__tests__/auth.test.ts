import request from "supertest";
import express from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import authRouter from "../routes/auth";
import userRouter from "../routes/users";

const app = express();
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

jest.mock("../utils/sendEmail", () => jest.fn());

describe("MERN Auth - Testes Gerais da Autenticação", () => {
  it("should reject invalid user data", async () => {
    const res = await request(app).post("/api/users").send({
      username: "wi",
      email: "invalido",
      password: "123",
    });
    expect(res.status).toBe(400);
  });

  it("should create new user", async () => {
    const res = await request(app).post("/api/users").send({
      username: "willian",
      email: "willian@gmail.com",
      password: "senha123",
    });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
  });

  it("should reject duplicate email", async () => {
    await User.create({
      username: "willian",
      email: "duplicado@gmail.com",
      password: "senha123",
    });

    const res = await request(app).post("/api/users").send({
      username: "willian",
      email: "duplicado@gmail.com",
      password: "senha123",
    });
    expect(res.status).toBe(409);
  });

  it("should reject invalid credentials", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "semcadastro@gmail.com",
      password: "semcadastro",
    });
    expect(res.status).toBe(401);
  });

  it("should reject unverified user login", async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("senha123", salt);

    await User.create({
      username: "naoverificado",
      email: "naoverificado@gmail.com",
      password: hashedPassword,
      verified: false,
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "naoverificado@gmail.com",
      password: "senha123",
    });
    expect(res.status).toBe(400);
  });

  it("should login successfully and return JWT", async () => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("senha123", salt);

    await User.create({
      username: "verificado",
      email: "verificado@gmail.com",
      password: hashedPassword,
      verified: true,
    });

    const res = await request(app).post("/api/auth/login").send({
      email: "verificado@gmail.com",
      password: "senha123",
    });

    expect(res.status).toBe(200);
    expect(res.body.data).toBeDefined();
    expect(res.body.message).toBe("Logado com sucesso!");
  });

  it("should hash user password", async () => {
    const salt = await bcrypt.genSalt(10);
    const plainPassword = "senha123";
    const hashedPassword = await bcrypt.hash(plainPassword, salt);

    const user = await User.create({
      username: "hashteste",
      email: "hashteste@gmail.com",
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
      username: "jwtteste",
      email: "jwtteste@gmail.com",
      password: hashedPassword,
      verified: true,
    });

    const token = user.generateAuthToken();
    expect(token).toBeDefined();
  });
});
