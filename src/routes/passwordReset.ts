import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Router } from "express";
import Joi from 'joi';
import { Token } from "../models/Token";
import { User } from '../models/User';
import sendEmail from '../utils/sendEmail';
export const passwordResetRouter = Router();

passwordResetRouter.post("/", async (req, res) => {
  try {
    const { email } = req.body;
    const emailSchema = Joi.object({
      email: Joi.string().email().required().label("email"),
    });
    const { error } = emailSchema.validate({ email });
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(409).send({ message: "Não existe usuário com este email." });
    }

    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex")
      }).save();
    }

    const url = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}`
    await sendEmail(user.email, "Redefinir senha", url);

    res.status(200).send({ message: "Um link para redefinir senha foi enviado para o seu e-mail" })
  } catch (error) {
    res.status(500).send({ message: "Erro interno do servidor" });
  }
})

passwordResetRouter.get('/:id/:token', async (req, res) => {
  try {
    const { id, token } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).send({ message: 'Usuário inválido' })
    }

    const userToken = await Token.findOne({
      userId: user._id,
      token: token
    });
    if (!userToken) {
      return res.status(400).send({ message: "Token Inválido" });
    }

    res.status(200).send({ message: "Url válida" });
  } catch (error) {
    res.status(500).send({ message: "Erro interno do servidor" })
  }
})

passwordResetRouter.post('/:id/:token', async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;

    const passwordSchema = Joi.object({
      password: Joi.string().min(6).required().label('password')
    })
    const { error } = passwordSchema.validate({ password });
    if (error) {
      return res.status(400).send({ message: error.details[0].message })
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).send({ message: 'Usuário inválido' })
    }

    const userToken = await Token.findOne({
      userId: user._id,
      token
    });
    if (!userToken) {
      return res.status(400).send({ message: "Token Inválido" });
    }

    if (!user.verified) {
      user.verified = true;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();
    await userToken.deleteOne();

    res.status(200).send({ message: "Senha redefinida com sucesso" })
  } catch (error) {
    res.status(500).send({ message: "Erro interno do servidor" })
  }
})

export default passwordResetRouter;