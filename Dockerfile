# Use Node.js 16 for better compatibility with react-scripts 4.0.3
FROM node:16.20.2-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache curl

# Note: NODE_OPTIONS with --openssl-legacy-provider will be set only at runtime
# to avoid conflicts during npm install phase

# Copy package files
COPY package*.json ./

# Install dependencies with legacy peer deps for React 18 compatibility
RUN npm install --legacy-peer-deps

# Copy the application code
COPY . .

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S app -u 1001 -G nodejs
RUN chown -R app:nodejs /app
USER app

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

# Start the application with explicit NODE_OPTIONS
CMD ["sh", "-c", "NODE_OPTIONS='--openssl-legacy-provider --max_old_space_size=4096' npm start"] 