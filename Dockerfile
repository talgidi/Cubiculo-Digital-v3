# Etapa 1: Instalación de pnpm y dependencias
FROM node:20-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiar archivos de configuración de pnpm y Prisma
COPY pnpm-lock.yaml package.json ./
COPY prisma ./prisma/

# Instalar dependencias incluyendo Prisma Client
RUN pnpm install --frozen-lockfile

# Etapa 2: Construcción (Build)
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generar el cliente de Prisma (esencial para Yoga + TS)
RUN npx prisma generate

# Construir el proyecto (compila TS a JS en la carpeta dist)
RUN pnpm run build

# Etapa 3: Producción (Runner)
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copiar solo lo necesario para la ejecución
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Exponer el puerto dinámico de Railway
EXPOSE ${PORT}

# Ejecutar migraciones antes de iniciar la API
# Se recomienda usar 'pnpm dlx' para asegurar la versión correcta de prisma
CMD npx prisma migrate deploy && node dist/index.js
