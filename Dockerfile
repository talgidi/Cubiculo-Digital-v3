# -----------------------------
# Etapa 1: Build
# -----------------------------
FROM node:20 AS builder

WORKDIR /app
ENV CI=true

# Habilitamos pnpm
RUN corepack enable && corepack prepare pnpm@10.28.1 --activate

# Copiamos lo mínimo para instalar
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/db/prisma ./packages/db/prisma/

# Instalamos todo
RUN pnpm install --frozen-lockfile

# Copiamos el resto del código
COPY . .

# 1. Generar cliente de Prisma (Esto lo crea dentro de node_modules/.pnpm/...)
RUN pnpm --filter @cubiculo/db run migrate:deploy
RUN pnpm --filter @cubiculo/db run generate
# 2. Build de la DB y API
RUN pnpm --filter @cubiculo/db run build
RUN pnpm --filter @cubiculo/api run build

# -----------------------------
# Etapa 2: Runtime
# -----------------------------
FROM node:20 AS runner

# Instalamos openssl (Indispensable para Supabase)
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production

# COPIAMOS TODO EL MONOREPO (Para no romper los enlaces simbólicos de pnpm)
# Esta es la forma más segura en pnpm 10 para evitar el ERR_MODULE_NOT_FOUND
COPY --from=builder /app ./

EXPOSE 4000

# Aplicamos migraciones pendientes y luego levantamos la API
CMD ["node", "apps/api/dist/index.js"]
