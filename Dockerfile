# =========================================
# Build Arguments
# =========================================
ARG NODE_VERSION=lts-alpine
ARG NGINX_VERSION=alpine

# =========================================
# Stage 1: Build the React.js Application
# =========================================
FROM node:${NODE_VERSION} AS builder

# Add labels for better image management
LABEL stage=builder
LABEL description="React.js application builder"

# Set working directory
WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json ./

# Install dependencies with cache mount for faster builds
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy source code and build the application
COPY . .
RUN npm run build

# =========================================
# Stage 2: Serve Static Files with Nginx
# =========================================
FROM nginx:${NGINX_VERSION} AS runner

# Remove default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application with proper ownership
COPY --from=builder --chown=nginx:nginx /app/dist /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
