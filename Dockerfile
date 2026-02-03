# -----------------------------
# Etapa 1: Build
# -----------------------------
FROM node:20 AS builder

# Directorio de trabajo
WORKDIR /app

# Copiamos package.json + pnpm-lock.yaml raíz y workspaces relevantes
COPY package.json pnpm-lock.yaml ./
COPY apps/api/package.json ./apps/api/
COPY packages/db/package.json ./packages/db/

# Habilitamos corepack y pnpm
RUN corepack enable && corepack prepare pnpm@10.28.1 --activate

# Instalamos dependencias de toda la monorepo
RUN pnpm install --frozen-lockfile

# Copiamos todo el código fuente
COPY . .

# Build API
RUN pnpm --filter @cubiculo/api run build

# -----------------------------
# Etapa 2: Runtime
# -----------------------------
FROM node:20-alpine AS runner
WORKDIR /app

# Copiamos solo lo necesario para correr API
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/db/node_modules ./packages/db/node_modules

# Copiamos package.json necesarios
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

# Copiamos archivo .env para Railway (o usa secretos en Railway)
COPY --from=builder /app/.env ./

# Exponemos el puerto de la API
EXPOSE 4000

# Comando por defecto
CMD ["node", "apps/api/dist/index.js"]
