# Frontend Dockerfile - Multi-stage build for production
# Stage 1: Build
FROM node:20-slim AS build-stage

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

# Copy build artifacts from build-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html

# Copy custom nginx config if available, otherwise use default
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
