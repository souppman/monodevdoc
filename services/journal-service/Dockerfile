
FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# Build Stage
FROM base AS build
COPY . /usr/src/app
WORKDIR /usr/src/app

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build Workspace Packages
RUN pnpm --filter devdoc-contracts build
RUN pnpm --filter devdoc-journal-service build

# Prepare Production Artifacts
# Uses 'pnpm deploy' to isolate the package and its production dependencies
RUN pnpm --filter devdoc-journal-service deploy --prod /prod/journal-service

# Final Image
FROM base AS journal-service
WORKDIR /app

# Copy production dependencies and package config from deploy stage
COPY --from=build /prod/journal-service /app

# Copy built artifacts (dist) explicitly as they might not be included in 'deploy' if not in 'files'
COPY --from=build /usr/src/app/services/journal-service/dist /app/dist

# Copy Prisma schema for runtime needs (if any)
COPY --from=build /usr/src/app/services/journal-service/prisma /app/prisma

EXPOSE 3000
CMD [ "node", "dist/app.js" ]
