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

## Configuração

**MongoDB:** Criar cluster no Atlas e inserir `MONGODB_URL` no `.env`

**Google OAuth:** Criar OAuth 2.0 Client ID → Authorized origins: `http://localhost:5173`

**Resend (Email):** 
1. Criar conta [Resend](https://resend.com/)
2. Verificar domínio ou `onboarding@resend.dev`
3. Gerar API Key
4. Adicionar `RESEND_API_KEY` e `RESEND_FROM_EMAIL` no `.env`

**Variáveis .env:**
Veja .env.example para a lista completa

## Segurança

Bcrypt · JWT · Validação Zod/Joi · NoSQL(MongoDB)