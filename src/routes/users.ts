import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Router } from 'express';
import { Token } from "../models/Token";
import { User, Validate } from "../models/User";
import sendEmail from "../utils/sendEmail";

const userRouter = Router();

userRouter.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const { error } = Validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }
    let user = await User.findOne({ email: req.body.email });

    if (user) {
      return res.status(409).send({ message: "Um usuário com este e-mail já existe." })
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = await new User({ username, email, password: hashedPassword }).save();

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const url = `${process.env.BASE_URL}/users/${user._id}/verify/${token.token}`;
    console.log(url);
    await sendEmail(user.email, "Verificar Email", url);

    res.status(201).json({ id: user._id, message: "Um e-mail foi enviado para sua conta, por favor verifique" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

userRouter.get("/:id/verify/:token", async (req, res) => {
  try {
    const { id, token } = req.params;

    const user = await User.findById(id);
    if (!user) return res.status(400).send({ message: "Usuário inválido" });
    if (user.verified) {
      return res.status(400).send({ message: "E-mail já verificado" });
    }

    const userToken = await Token.findOne({
      userId: user._id,
      token: token
    });
    if (!userToken) {
      return res.status(400).send({ message: "Token Inválido" });
    }

    await User.updateOne({ _id: user._id }, { verified: true });

    await userToken.deleteOne();

    res.status(200).send({ message: "E-mail verificado com sucesso" });
  } catch (error) {
    res.status(500).send({ message: "Erro interno do servidor" });
  }
});

userRouter.delete("/:id", async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado" });
    }

    await User.deleteOne({ _id: userId });

    await Token.deleteMany({ userId });

    res.status(200).json({ message: "Usuário excluído com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

export default userRouter;