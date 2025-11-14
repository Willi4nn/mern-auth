# MERN Auth — Autenticação (MERN + TypeScript)

## Stacks
* **Frontend:** React, TS, React Router, React Hook Form, Zod, Axios, Tailwind
* **Backend:** Node.js, Express, TS, MongoDB, Mongoose, Brevo API (Email)
* **Auth:** Login (Email/Senha + Google OAuth), JWT, verificação de email.
* **Segurança:** Rota protegida (client/server), validação Zod, Bcrypt, Helmet, CORS.

## Funcionalidades

- Registro/login por email + senha
- Login social (Google OAuth 2.0)
- Recuperação e verificação por email
- Rota protegida (client/server)
- Validação de formulários (client/server)
- JWT com expiração + rate limiting

## Rodando Local
```bash
cd mern-auth
npm install
cp .env.example .env
npm run start
npm run dev
```

## Configuração .env
Usar o .env.example como base

## MONGODB_URL
* Crie cluster grátis no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
* Pegue a URL de conexão (string) e cole no `.env`.

## GOOGLE_OAUTH_CLIENT_ID
* Vá ao Google Cloud Console → APIs & Services → Credentials.
* Crie um "OAuth 2.0 Client ID".
* Em **Authorized JavaScript origins**, adicione `http://localhost:5173`.
* Copie o **Client ID** para o `.env`.

## BREVO_API_KEY (Envio de emails)
* Crie conta [Brevo](https://www.brevo.com/).
* Settings → SMTP & API → API Keys.
* Gere API key e cole no `.env`.
* Defina `BREVO_FROM_EMAIL`.