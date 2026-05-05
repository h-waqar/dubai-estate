# Node 20 Alpine
FROM node:20-alpine

# Needed for Next.js + SWC on Alpine
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy dependency manifests first (for Docker cache)
COPY package.json package-lock.json* ./

# Copy prisma schema separately (Prisma generate may need it)
COPY prisma ./prisma

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Expose Next.js port
EXPOSE 3000

# Run dev server
CMD ["npm", "run", "dev"]