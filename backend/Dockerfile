# Production-ready Backend Dockerfile
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# In a real production environment, you might build TypeScript or run other steps here
# For this Express app, we just copy the files

FROM node:20-slim

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 5000

CMD ["node", "server.js"]
