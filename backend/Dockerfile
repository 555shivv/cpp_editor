# Use a base image with g++ installed
FROM gcc:latest

# Set the working directory inside the container
WORKDIR /app/backend

# Copy the backend code to the container
COPY . .

# Install Node.js and dependencies (if not already included in the base image)
RUN apt-get update && apt-get install -y nodejs npm

# Install project dependencies
RUN npm install

# Expose the port your backend uses
EXPOSE 5000

# Command to start the backend server
CMD ["npm", "start"]
