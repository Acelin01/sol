# Solana Test Program Client

This client application interacts with the Solana test program located in `programs/test/src/lib.rs`.

## Prerequisites

- Solana CLI tools installed and configured
- Node.js and npm/yarn installed
- Anchor framework installed

## Compilation and Deployment Instructions

### 1. Build the Solana Program

```bash
# Navigate to the project root
cd e:\资料\AIGC\sol\test

# Build the program
anchor build
```

### 2. Deploy the Program to Devnet

Make sure your Solana CLI is configured to use devnet:

```bash
solana config set --url https://api.devnet.solana.com
```

Get some SOL from the devnet faucet (you'll need this to pay for deployment):

```bash
solana airdrop 2
```

Then deploy the program:

```bash
anchor deploy
```

### 3. Install Client Dependencies

```bash
# Navigate to the app directory
cd app

# Install dependencies
npm install
# or
yarn install
```

### 4. Run the Client

```bash
# Run the client
npm start
# or
yarn start
```

## Troubleshooting

If you encounter issues with the Solana validator requiring admin privileges, try running your command prompt or terminal as administrator.

If you see errors about missing environment variables when building with Anchor, make sure your Solana CLI is properly configured:

```bash
solana config get
```

Your wallet path should be correctly set in the Solana config.
