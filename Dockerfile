# Node 20 Alpine
FROM node:20-alpine

# Needed for Next.js + SWC on Alpine
RUN apk add --no-cache libc6-compat

# Enable pnpm via Corepack
RUN corepack enable

WORKDIR /app

# Copy dependency manifests first (for Docker cache)
COPY package.json pnpm-lock.yaml ./

# Copy prisma schema separately (Prisma generate may need it)
COPY prisma ./prisma

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the project
COPY . .

# Expose Next.js port
EXPOSE 3000

# Run dev server
CMD ["pnpm", "dev"]