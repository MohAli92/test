FROM mcr.microsoft.com/devcontainers/javascript-node:0-18

# Install additional OS packages
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends git

# Set working directory
WORKDIR /workspace

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd client && npm install

# Expose ports
EXPOSE 3000 5000 