# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 5001

# Start the service
CMD ["npm", "run", "start"]
