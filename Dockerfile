# -----------------------------
# Etapa 1: Build
# -----------------------------
FROM node:20 AS builder

WORKDIR /app
ENV CI=true

# Habilitamos pnpm
RUN corepack enable && corepack prepare pnpm@10.28.1 --activate

# Copiamos manifests y workspace
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/db/prisma ./packages/db/prisma/

# Instalamos dependencias
RUN pnpm install --frozen-lockfile

# Copiamos el resto del código
COPY . .

# 1. Generar cliente de Prisma
RUN pnpm --filter @cubiculo/db run generate
# 2. Build de la DB (genera el /dist que usará la API)
RUN pnpm --filter @cubiculo/db run build
# 3. Build de la API
RUN pnpm --filter @cubiculo/api run build

# -----------------------------
# Etapa 2: Runtime (Basada en tu versión exitosa)
# -----------------------------
FROM node:20 AS runner

# Instalamos openssl necesario para la conexión SSL de Supabase
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

WORKDIR /app
ENV NODE_ENV=production

# Copiamos node_modules completo para mantener los enlaces simbólicos de pnpm
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copiamos compilados de la API
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

# Copiamos el paquete de la DB completo (importante para que el import funcione)
COPY --from=builder /app/packages/db ./packages/db

EXPOSE 4000

CMD ["node", "apps/api/dist/index.js"]
