# Build stage
FROM oven/bun:latest AS build

WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy application code
COPY . .

# Environment variables for build time
ARG API_URL=http://localhost:6001/api
ARG BACKEND_URL=http://localhost:6001
ARG PUBLIC_API_URL=http://localhost:6001/api
ARG PUBLIC_BACKEND_URL=http://localhost:6001
ARG ACCESS_TOKEN_MAX_AGE=3600
ARG REFRESH_TOKEN_MAX_AGE=604800

ENV API_URL=$API_URL
ENV BACKEND_URL=$BACKEND_URL
ENV PUBLIC_API_URL=$PUBLIC_API_URL
ENV PUBLIC_BACKEND_URL=$PUBLIC_BACKEND_URL
ENV ACCESS_TOKEN_MAX_AGE=$ACCESS_TOKEN_MAX_AGE
ENV REFRESH_TOKEN_MAX_AGE=$REFRESH_TOKEN_MAX_AGE

# Build the application
# We try to increase ulimit, but if it fails (due to lack of privileges), 
# the user should run podman build with --ulimit nofile=65536:65536
RUN ulimit -n 65536 || echo "Could not increase ulimit" && bun run build

# Runtime stage
FROM oven/bun:latest

WORKDIR /app

# Copy build output and dependencies
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

# Expose port
EXPOSE 3000

# Start the application
CMD ["bun", "run", "./build/index.js"]
