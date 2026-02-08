# -----------------------------
# Etapa 1: Build
# -----------------------------
FROM node:20-slim AS builder

# Instalar openssl para Prisma
RUN apt-get update && apt-get install -y openssl

WORKDIR /app

# Habilitamos pnpm
RUN corepack enable && corepack prepare pnpm@10.28.1 --activate

# Copiamos manifiestos
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/
COPY packages/db/prisma ./packages/db/prisma/

# Instalamos dependencias
RUN pnpm install --frozen-lockfile

# Copiamos el resto del código
COPY . .

# Generar y Build
RUN pnpm --filter @cubiculo/db run generate
RUN pnpm --filter @cubiculo/db run build
RUN pnpm --filter @cubiculo/api run build

# Limpiar dependencias de desarrollo para ahorrar espacio
RUN pnpm prune --prod

# -----------------------------
# Etapa 2: Runtime
# -----------------------------
FROM node:20-slim AS runner

WORKDIR /app
ENV NODE_ENV=production

# Requerido para Prisma Client
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copiamos TODA la estructura de node_modules (incluye links del workspace)
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Copiamos los paquetes compilados
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json
COPY --from=builder /app/packages/db/dist ./packages/db/dist
COPY --from=builder /app/packages/db/package.json ./packages/db/package.json
# Muy importante: Prisma necesita el motor generado
COPY --from=builder /app/packages/db/node_modules/.prisma ./packages/db/node_modules/.prisma

EXPOSE 4000

CMD ["node", "apps/api/dist/index.js"]
