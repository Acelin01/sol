# Docker-based Solana Development Environment

This guide will help you set up a Docker container for Solana development, which can help bypass some of the network and permission issues you're experiencing.

## Prerequisites

1. Install Docker Desktop for Windows from [https://www.docker.com/products/docker-desktop/](https://www.docker.com/products/docker-desktop/)
2. Make sure virtualization is enabled in your BIOS

## Setup Steps

1. Create a Dockerfile in your project directory:

```dockerfile
FROM solanalabs/solana:stable

# Install Node.js and npm
RUN apt-get update && apt-get install -y curl
RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash -
RUN apt-get install -y nodejs

# Install Anchor
RUN npm install -g @project-serum/anchor-cli

# Set up working directory
WORKDIR /app

# Copy project files
COPY . .

# Expose ports for Solana validator
EXPOSE 8899
EXPOSE 8900

# Start command
CMD ["/bin/bash"]
```

2. Build the Docker image:

```bash
docker build -t solana-dev .
```

3. Run the Docker container:

```bash
docker run -it --name solana-container -p 8899:8899 -p 8900:8900 -v "$(pwd):/app" solana-dev
```

4. Inside the container, you can:
   - Start a local validator: `solana-test-validator`
   - Build your program: `anchor build`
   - Deploy your program: `anchor deploy`

## Using the Docker Environment

1. Start the Docker container:
```bash
docker start -i solana-container
```

2. In the container, start a local Solana validator:
```bash
solana-test-validator
```

3. In another terminal, connect to the running container:
```bash
docker exec -it solana-container bash
```

4. Build and deploy your program:
```bash
anchor build
anchor deploy
```

5. Run your client code inside the container:
```bash
cd app
node simple-client.js
```

## Benefits of Using Docker

- Isolated environment with all dependencies pre-installed
- Avoids permission issues on Windows
- Can run a local validator without administrator privileges
- Consistent environment across different machines
