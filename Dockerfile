# Use Node 20 LTS as base image
FROM node:20

# Set working directory inside container
WORKDIR /app

# Copy dependency manifests first
COPY package*.json ./

# Install dependencies (including dev for build)
RUN npm install

# Copy rest of the project
COPY . .

# Build TypeScript -> JavaScript
RUN npm run build

# Expose runtime port (Back4App injects PORT)
EXPOSE 3000

# Start the compiled app
CMD ["npm", "start"]
