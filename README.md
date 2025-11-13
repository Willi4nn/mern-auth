# MERN Auth — Autenticação (MERN + TypeScript)

Sistema de autenticação full-stack com foco em frontend (React + TypeScript) e integração com API.

## Funcionalidades

- Registro/login por email + senha
- Login social (Google OAuth 2.0)
- Recuperação e verificação por email
- Rotas protegidas (client/server)
- Validação de formulários (client/server)
- JWT com expiração + rate limiting

## Stack

**Frontend:** React · TypeScript · React Router · React Hook Form · Zod · Axios · Tailwind

**Backend:** Node.js · Express · TypeScript · MongoDB · Mongoose · JWT · Bcrypt · Nodemailer · Helmet

## Rodar local

```bash
cd mern-auth
npm install
cp .env.example .env
npm run start
npm run dev
```

## Deploy / Emails — Aviso importante

Aviso: o Render (plataforma de produção) bloqueia conexões SMTP de saída por razões de segurança.  
Isto significa que o envio de email via SMTP (ex.: Gmail app password) **não funcionará em produção no Render**.
Em desenvolvimento local: SMTP (Gmail) funciona com senha de app.

## Configuração

**MongoDB:** Criar cluster no Atlas e inserir `MONGODB_URL` no `.env`

**Google OAuth:** Criar OAuth 2.0 Client ID → Authorized origins: `http://localhost:5173`

**Gmail:** Ativar 2-step e gerar senha de app (variáveis `USER`/`PASS`)

**Variáveis .env:**
Veja .env.example para a lista completa

## Segurança

Bcrypt · JWT · Validação Zod/Joi · NoSQL(MongoDB)