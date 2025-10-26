# --- STAGE 1: Builder ---
# This stage installs all dependencies and builds your TypeScript code.
FROM node:20-alpine AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable

# Copy package files and the pnpm lockfile
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (dev included)
RUN pnpm install

# Copy the rest of your source code
COPY . .

# Generate the Prisma client so 'tsc' can find the types
RUN pnpm exec prisma generate

# Build the TypeScript project
RUN pnpm run build

# --- STAGE 2: Production ---
# This stage builds a new, lightweight image with *only* what's
# needed to run the app in production.
FROM node:20-alpine AS production

WORKDIR /app

# Set node environment to production
ENV NODE_ENV=production

# Enable pnpm
RUN corepack enable

# Copy package files and lockfile
COPY package.json pnpm-lock.yaml ./

# Install *only* production dependencies
# The @prisma/client postinstall script will *skip* generation
# because the schema.prisma file isn't here yet. This is normal.
RUN pnpm install --prod

# --- THIS IS THE FIX ---
# We solve the chicken-and-egg problem here.

# 1. Copy your schema from the builder stage
COPY --from=builder /app/prisma ./prisma

# 2. NOW, install the Prisma CLI (which is a devDep)
# This is the line that fixes the 'Command "prisma" not found' error.
RUN pnpm add prisma

# 3. Manually run 'prisma generate'.
# It now has the schema, the @prisma/client, and the CLI.
RUN pnpm exec prisma generate

# 4. Finally, copy your compiled application code
COPY --from=builder /app/dist ./dist

# Expose the port your app runs on (from your .env)
EXPOSE 8080

# The command to start the application
# This runs 'node dist/index.js'
CMD ["pnpm", "run", "start"]

