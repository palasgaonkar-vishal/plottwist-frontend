# Use Node.js 14 for maximum compatibility with react-scripts 4.0.3
# Node 14 doesn't have OpenSSL 3.0 issues that require legacy provider
FROM node:14-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache curl

# Set memory limit for Node.js to prevent out-of-memory issues during build
ENV NODE_OPTIONS="--max_old_space_size=4096"

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

# Start the application (NODE_OPTIONS already set in ENV)
CMD ["npm", "start"] 