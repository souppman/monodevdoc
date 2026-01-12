
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# Increase Node.js memory limit to prevents OOM during build/runtime (Railway 2GB limit often hit)
ENV NODE_OPTIONS="--max-old-space-size=4096"
RUN corepack enable

# Build Stage
FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app

# Install system dependencies (Prisma requires openssl)
RUN apt-get update -y && apt-get install -y openssl

# Install dependencies
RUN pnpm install --frozen-lockfile

# Fix for Prisma Generate requiring DATABASE_URL
# This is a dummy URL just for the build process validation
ENV DATABASE_URL="postgresql://build-dummy:5432/build-db"

# Build Workspace Packages
RUN pnpm --filter devdoc-contracts build
RUN pnpm --filter devdoc-journal-service build

# Prepare Production Artifacts
# Uses 'pnpm deploy' to isolate the package and its production dependencies
RUN pnpm --filter devdoc-journal-service deploy --prod /prod/journal-service

# Final Image
FROM base AS journal-service
WORKDIR /app

# Install system dependencies (Prisma requires openssl at runtime)
RUN apt-get update -y && apt-get install -y openssl

# Copy production dependencies and package config from deploy stage
COPY --from=build /prod/journal-service /app

# Copy built artifacts (dist) explicitly
COPY --from=build /usr/src/app/services/journal-service/dist /app/dist

# Copy Prisma schema for runtime needs
COPY --from=build /usr/src/app/services/journal-service/prisma /app/prisma

# Regenerate Prisma Client in production image to ensure it matches the environment
# We need the dummy ENV again for validation during generation
ENV DATABASE_URL="postgresql://build-dummy:5432/build-db"

# Remove prisma.config.ts to avoid "Cannot find module 'prisma/config'" error
# (The 'prisma' package is a devDep and not present in prod image)
RUN rm -f prisma.config.ts

# Use strict version matching package.json to avoid v7 breaking changes
RUN npx prisma@6.19.1 generate

EXPOSE 3000
CMD [ "node", "dist/app.js" ]
