# ============================================
# PROCESS.CARD - Production Dockerfile
# SQLite + Express Backend + React Frontend
# ============================================

# Stage 1: Build Frontend
FROM node:20-slim AS frontend-builder

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
FROM node:20-slim AS backend-builder

WORKDIR /app/backend

COPY backend/package*.json ./
# Debian/Ubuntu usually works with prebuilds for better-sqlite3, 
# but if build is needed, python3 and make are needed.
# Let's try reliance on prebuilds first, which usually works on standard Node images.
RUN npm ci --only=production

# Stage 3: Production
FROM node:20-slim AS production

WORKDIR /app

# Install SQLite CLI (optional, useful for debugging)
RUN apt-get update && apt-get install -y sqlite3 && rm -rf /var/lib/apt/lists/*

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
