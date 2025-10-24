FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install dependencies first (package.json must be present)
COPY package.json package-lock.json* ./

RUN npm ci --production

# Copy source
COPY . .

# Build step if you have any (none by default)
ENV NODE_ENV=production

EXPOSE 3000

CMD ["npm", "start"]
