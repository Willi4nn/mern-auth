import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Router } from "express";
import Joi from "joi";
import { Token } from "../models/Token";
import { User } from "../models/User";
import sendEmail from "../utils/sendEmail";
export const authRouter = Router();

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { error } = LoginValidate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'E-mail ou senha inválidos' });
    }

    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });

      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `${process.env.BASE_URL}/users/${user._id}/verify/${token.token}`;
        await sendEmail(user.email, "Verificar Email", url);
      }
      return res.status(400).json({ message: "Um e-mail foi enviado para sua conta, por favor verifique" });
    }

    const token = user.generateAuthToken();
    res.status(200).json({ data: token, message: "Logado com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro interno do servidor" });
  }
});

export const LoginValidate = (user: { email: string, password: string }) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(user);

};

export default authRouter;