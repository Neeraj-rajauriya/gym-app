# # Base image
# FROM node:18

# # Set working directory
# WORKDIR /app

# # Copy package files
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy all backend code
# COPY . .

# # Expose backend port
# EXPOSE 4000

# # Start backend
# CMD ["npm", "start"]

FROM node:18

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Environment variables
ENV PORT=4000
ENV NODE_ENV=production

# Note: Sensitive variables come from docker-compose.yml

EXPOSE 4000

CMD ["npm", "start"]