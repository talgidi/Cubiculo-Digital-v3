# -----------------------------
# Etapa 1: Build
# -----------------------------
FROM node:20 AS builder

WORKDIR /app

ENV CI=true

# Copiamos manifests necesarios
COPY package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/

# Habilitamos pnpm
RUN corepack enable && corepack prepare pnpm@10.28.1 --activate

# Instalamos dependencias del monorepo
RUN pnpm install --frozen-lockfile

# Copiamos el resto del código
COPY . .# 🔑 PRISMA PRIMERO

RUN pnpm --filter @cubiculo/db run generate

# 🔑 LUEGO build db
RUN pnpm --filter @cubiculo/db run build

# Build SOLO de la API
RUN pnpm --filter @cubiculo/api run build

# -----------------------------
# Etapa 2: Runtime
# -----------------------------
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copiamos solo lo necesario para ejecutar
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/packages/db ./packages/db
COPY --from=builder /app/package.json ./package.json

# Railway inyecta PORT
EXPOSE 4000

CMD ["node", "apps/api/dist/index.js"]
