# Use the official Node.js image as the base image
FROM node:22.9.0

# Set the working directory
WORKDIR /workspace

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the application port
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]