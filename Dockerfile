# Use Node.js version 20 (Lightweight version based on Alpine Linux)
FROM node:20-alpine

# Required for Next.js SWC/Turbopack binaries on Alpine Linux
RUN apk update && apk add --no-cache libc6-compat

# Set the working directory inside the container (like 'cd /app')
WORKDIR /app

# Copy package files first.
# We do this separately to take advantage of Docker's caching mechanism.
# If package.json doesn't change, Docker skips "npm install" on re-builds!
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install

# Copy the rest of your application code into the container
COPY . .

# Tell Docker that this container will listen on port 3000
EXPOSE 3000

# The command to start the application (Development mode)
CMD ["npm", "run", "dev"]
