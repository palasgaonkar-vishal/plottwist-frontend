FROM node:16-alpine

# Set working directory
WORKDIR /app

# Install system packages
RUN apk add --no-cache wget

# Copy package files
COPY package*.json ./

# Install with stable versions - react-scripts 4.0.3 + React 18.2
RUN npm cache clean --force && \
    rm -rf node_modules package-lock.json && \
    npm install --legacy-peer-deps

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Start development server
CMD ["npm", "start"] 