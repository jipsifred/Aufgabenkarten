# ============================================
# PROCESS.CARD - Production Dockerfile
# SQLite + Express Backend + React Frontend
# ============================================

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend files
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./

COPY index.html ./
COPY src ./src

# Install and build
RUN npm ci
RUN npm run build

# Stage 2: Build Backend
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

COPY backend/package*.json ./
RUN npm ci --only=production

# Stage 3: Production
FROM node:20-alpine AS production

WORKDIR /app

# Install SQLite
RUN apk add --no-cache sqlite

# Copy backend
COPY backend ./backend
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules

# Copy frontend build
COPY --from=frontend-builder /app/frontend/dist ./backend/public

# Create data directories
RUN mkdir -p /app/data/uploads

# Set permissions
RUN chown -R node:node /app

USER node

WORKDIR /app/backend

EXPOSE 3000

CMD ["node", "server.js"]
