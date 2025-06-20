# # Base image
# FROM node:18

# # Set working directory
# WORKDIR /app

# # Copy package files
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy all files
# COPY . .

# # Build the Next.js app
# RUN npm run build

# # Expose production port
# EXPOSE 3000

# # Start production server
# CMD ["npm", "start"]

FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

RUN npm run build

# Final production image
FROM node:18
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

EXPOSE 3000

# ✅ Use npx to run next server
CMD ["npx", "next", "start"]
