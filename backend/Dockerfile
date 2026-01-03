# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy rest of the backend code
COPY . .

# Expose port (Render will override PORT)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
