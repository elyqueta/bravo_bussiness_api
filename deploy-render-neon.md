# Deploy da Bravo Business API — Render (sem Docker) + Neon Postgres

> Objetivo: colocar a API a correr na Render usando o build nativo Node (sem Dockerfile) e uma base de dados Postgres na Neon, sem destruir nada do que já existe. Este guia é aditivo — não apaga migrations, dados nem configs atuais.

---

## 0. Antes de começar (não destrutivo)

- Não apagar `Dockerfile` nem `docker-compose.yml` — ficam para uso local/futuro, só não são usados neste deploy.
- Não apagar `render.yaml` atual — vamos só ajustar (a secção `pserv` do Postgres da Render deixa de ser necessária, mas não obriga a apagar já).
- Fazer isto numa branch nova (ex: `deploy/render-neon`) e só fazer merge depois de confirmar que o health check responde bem.
- Se já existir uma instância antiga em produção, este processo cria uma **nova** instância + **nova** BD Neon em paralelo. Só se aponta o domínio/DNS final depois de validar.

---

## 1. Criar a base de dados na Neon

1. Criar conta/projeto em https://neon.tech.
2. Criar um projeto novo (ex: `bravo-business`).
3. Na dashboard da Neon, ir a **Connection Details** e copiar a **connection string** no formato:
   ```
   postgresql://<user>:<password>@<host>.neon.tech/<database>?sslmode=require
   ```
4. Guardar essa string — vai ser o `DATABASE_URL` na Render.
5. A Neon exige SSL sempre (`sslmode=require`). O código já trata isso em `src/database/pool.ts`:
   ```ts
   ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
   ```
   Como `NODE_ENV=production` na Render, isto já é compatível com a Neon. **Não precisa de alterar código.**

---

## 2. Aplicar o schema na Neon

O projeto tem duas fontes de schema — usar **as duas**, pela ordem certa, apontando `DATABASE_URL` para a Neon:

1. Correr o schema base (ficheiros SQL avulsos, aplicar por ordem):
   - `migrations/001_init_schema.sql`
   - `migrations/002_fix_category_icon_length.sql`
   - `migrations/003_fix_category_icon_length.sql`

   Exemplo local (substitui pela connection string da Neon):
   ```bash
   psql "postgresql://<user>:<password>@<host>.neon.tech/<database>?sslmode=require" -f migrations/001_init_schema.sql
   psql "postgresql://<user>:<password>@<host>.neon.tech/<database>?sslmode=require" -f migrations/002_fix_category_icon_length.sql
   psql "postgresql://<user>:<password>@<host>.neon.tech/<database>?sslmode=require" -f migrations/003_fix_category_icon_length.sql
   ```

2. (Opcional) Criar o admin inicial e seed de catálogo depois do deploy, via endpoint público já existente:
   ```
   POST /api/seed/init
   { "email": "...", "password": "...", "fullName": "..." }
   ```
   ou correr `npm run seed` localmente apontando `DATABASE_URL` para a Neon.

> Nota: `npm run migrate:up` usa `node-pg-migrate`, que por convenção espera ficheiros de migration no formato dele. Como o projeto atual guarda o schema em `.sql` avulsos dentro de `migrations/`, o caminho mais seguro e testado é aplicar esses `.sql` diretamente com `psql`, como acima. Não é preciso reescrever isto agora — só documentar para não confundir.

---

## 3. Ajustar `render.yaml` (sem Docker, com Neon)

O `render.yaml` atual já está configurado para build nativo Node (`env: node`, sem Dockerfile) — isso já está certo, não mexer nessa parte. Só é preciso:

- Remover (ou deixar comentada) a secção `pserv` do Postgres da própria Render, já que a BD passa a ser a Neon.
- Trocar o `DATABASE_URL` de `fromDatabase` para `sync: false` (valor definido manualmente no dashboard).

```yaml
services:
  - type: web
    name: bravo-bussiness-api
    env: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: DATABASE_URL
        sync: false          # <- definido manualmente no dashboard com a connection string da Neon
      - key: CORS_ORIGIN
        sync: false
      - key: JWT_SECRET
        generateValue: true
      - key: JWT_ACCESS_EXPIRES_IN
        value: 15m
      - key: BCRYPT_SALT_ROUNDS
        value: 12
      - key: CLOUDINARY_CLOUD_NAME
        sync: false
      - key: CLOUDINARY_API_KEY
        sync: false
      - key: CLOUDINARY_API_SECRET
        sync: false

# secção "pserv" (Postgres da Render) removida — a BD passa a ser a Neon
```

Se preferires não editar o `render.yaml` já commitado, também dá para configurar tudo manualmente no dashboard da Render (sem usar Blueprint) — ver secção 4.

---

## 4. Criar o Web Service na Render

1. Dashboard Render → **New** → **Web Service**.
2. Ligar o repositório Git do projeto.
3. Configurar:
   - **Environment**: `Node` (não escolher Docker)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/health`
   - **Plan**: Free (ou o que preferires)
4. Node version: garantir >= 20 (o `package.json` já exige `"node": ">=20.0.0"` em `engines`). Se a Render não detetar sozinha, definir a env var `NODE_VERSION` (ex: `20`).

---

## 5. Variáveis de ambiente na Render

Definir no separador **Environment** do serviço:

| Variável | Valor |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `10000` (a Render injeta a porta real automaticamente, mas mantém consistência com o `render.yaml`) |
| `DATABASE_URL` | connection string da Neon (`...?sslmode=require`) |
| `CORS_ORIGIN` | domínio(s) do frontend, separados por vírgula (ex: `https://teu-frontend.vercel.app`) |
| `JWT_SECRET` | string aleatória com 32+ caracteres (podes deixar a Render gerar com `generateValue: true` no blueprint, ou gerar tu) |
| `JWT_ACCESS_EXPIRES_IN` | `15m` |
| `BCRYPT_SALT_ROUNDS` | `12` |
| `CLOUDINARY_CLOUD_NAME` | valor da tua conta Cloudinary |
| `CLOUDINARY_API_KEY` | valor da tua conta Cloudinary |
| `CLOUDINARY_API_SECRET` | valor da tua conta Cloudinary |
| `RATE_LIMIT_WINDOW_MS` | `900000` (opcional, já tem default) |
| `RATE_LIMIT_MAX` | `100` (opcional, já tem default) |

`src/config/env.ts` valida tudo isto com Zod no arranque — se faltar alguma variável obrigatória, o processo falha logo com uma mensagem clara no log, em vez de arrancar mal configurado.

---

## 6. Deploy e verificação

1. Fazer push da branch e disparar o deploy na Render.
2. Acompanhar os logs do build (`npm install && npm run build`) e do arranque (`npm start`).
3. Testar o health check:
   ```
   GET https://<teu-servico>.onrender.com/health
   ```
   Resposta esperada:
   ```json
   { "status": "ok", "service": "bravo-bussiness-api", "database": "connected", "timestamp": "..." }
   ```
4. Se `database: "disconnected"` — confirmar `DATABASE_URL` (typo, `sslmode=require`, credenciais) e que o schema (secção 2) já foi aplicado na Neon.
5. Testar um endpoint público sem auth, ex: `GET /api/categories`.
6. Testar login/admin (se já tiver seed feito): `POST /api/auth/login`.

---

## 7. Escalar depois (sem quebrar nada)

- A Neon permite branches de BD (ex: `main` para produção, `dev`/`staging` para testar migrations novas antes de aplicar em produção) — útil antes de qualquer alteração de schema futura.
- Para subir de plano na Render (mais RAM/CPU, sem cold start no free tier), basta mudar o `plan` no serviço — não afeta a Neon nem o código.
- Guardar sempre a connection string da Neon num gestor de segredos (não commitar no `.env` do repositório) — `.env.example` já não tem valores reais, manter assim.
- Se decidires mais tarde formalizar as migrations com `node-pg-migrate` (usar `migrate:up`/`migrate:down` a sério), fazer isso como trabalho à parte, testado primeiro numa branch da Neon — não misturar com este deploy inicial.
