# ---------- build stage ----------
FROM node:20-alpine AS build

WORKDIR /usr/src/app

# Install dependencies first (layer cache)
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev || npm install --omit=dev

# ---------- production stage ----------
FROM node:20-alpine

WORKDIR /usr/src/app

# Create a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Copy only what's needed from the build stage
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY . .

# Remove files not needed at runtime
RUN rm -f .env .env.example Dockerfile .dockerignore

# Own the workdir as the non-root user
RUN chown -R appuser:appgroup /usr/src/app

USER appuser

EXPOSE 8080

CMD ["npm", "start"]
