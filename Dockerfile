# ─────────────────────────────────────────────
# Stage 1: Build
# ─────────────────────────────────────────────
FROM oven/bun:1-alpine AS build

WORKDIR /app

# Copy manifest dulu (layer cache)
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

# Copy source
COPY . .

# Build SvelteKit
# Variabel PUBLIC_* perlu di-set saat BUILD karena di-embed ke JS oleh Vite
# Nilai ini bisa di-override via --build-arg saat docker build
ARG PUBLIC_API_URL=https://ppid-sulselprov.minmat2026.my.id/api
ARG PUBLIC_BACKEND_URL=https://ppid-sulselprov.minmat2026.my.id
ARG PUBLIC_RECAPTCHA_SITE_KEY=6LewZc8sAAAAAK0mRvWa18O1T6M6lTbOEmlRjCKp

ENV PUBLIC_API_URL=$PUBLIC_API_URL \
    PUBLIC_BACKEND_URL=$PUBLIC_BACKEND_URL \
    PUBLIC_RECAPTCHA_SITE_KEY=$PUBLIC_RECAPTCHA_SITE_KEY

RUN bun run build

# ─────────────────────────────────────────────
# Stage 2: Production runner
# ─────────────────────────────────────────────
FROM oven/bun:1-alpine

WORKDIR /app

# Copy hasil build dan node_modules yang dibutuhkan runtime
COPY --from=build /app/build ./build
COPY --from=build /app/package.json ./
# Jika adapter-node memakai node_modules di runtime:
COPY --from=build /app/node_modules ./node_modules

# ── Runtime env defaults ──────────────────────────────────────────────────
# Variabel PRIVATE (BACKEND_URL, RECAPTCHA_SECRET_KEY, dll) TIDAK di-embed
# ke JS. Aman di-set saat runtime (dari docker-compose environment / .env).
ENV NODE_ENV=production \
    PORT=3000 \
    HOST=0.0.0.0

EXPOSE 3000

CMD ["bun", "./build/index.js"]
