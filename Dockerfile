# -----------------------------
# Etapa 1: Build
# -----------------------------
FROM node:20 AS builder

# Directorio de trabajo
WORKDIR /app

# Copiar package.json raíz y lockfile
COPY package.json pnpm-lock.yaml ./

# Copiar package.json de la API (workspace)
COPY apps/api/package.json ./apps/api/

# Activar pnpm
RUN corepack enable && corepack prepare pnpm@10.28.1 --activate

# Instalar dependencias de toda la monorepo
RUN pnpm install --frozen-lockfile

# Copiar todo el código fuente
COPY . .

# Build API
RUN pnpm --filter @cubiculo/api run build

# -----------------------------
# Etapa 2: Runtime
# -----------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Copiar node_modules y API compilada desde builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Copiar package.json de la API (opcional)
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

# Copiar archivo .env con variables de producción
COPY --from=builder /app/.env ./

# Exponer puerto de la API
EXPOSE 4000

# Comando por defecto
CMD ["node", "apps/api/dist/index.js"]
