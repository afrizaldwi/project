# /web-frontend/Dockerfile.dev

# 1. Use the official Node.js Alpine image
FROM node:24.14.1-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy only the package files first (This is the caching trick!)
COPY package.json package-lock.json* ./

# 4. Install the dependencies
RUN npm install

# 5. Copy the rest of your React code
COPY . .

# 6. Expose the port Vite uses
EXPOSE 5173

# 7. Command to start the development server
CMD ["npm", "run", "dev", "--", "--host"]