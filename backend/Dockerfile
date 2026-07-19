FROM node:20-alpine

WORKDIR /app

# Copy dependency files first
COPY package*.json ./

# Install exact dependencies from package-lock.json
RUN npm ci

# Copy complete backend source code
COPY . .

# Generate Prisma Client from schema.prisma
RUN npx prisma generate

# Compile TypeScript into the dist folder
RUN npm run build

EXPOSE 5000

# Apply pending database migrations and start production server
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]