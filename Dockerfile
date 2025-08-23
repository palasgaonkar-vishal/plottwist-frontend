# Use Node.js 18 alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apk add --no-cache curl

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Create a non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S app -u 1001 -G nodejs
RUN chown -R app:nodejs /app
USER app

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000 || exit 1

# Start the application
CMD ["npm", "start"] 