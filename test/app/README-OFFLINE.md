# Solana Program Development - Offline Guide

This guide explains how your Solana program works and how to interact with it, even when you're facing network connectivity issues.

## Your Solana Program

Your program (`programs/test/src/lib.rs`) is a simple Anchor-based Solana program with an `initialize` function:

```rust
use anchor_lang::prelude::*;

declare_id!("FeiNMM9u1p1nWbjsBqNFoEvEfXkngxebMX3aA5GMvePN");

#[program]
pub mod test {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
```

This program:
1. Defines a program ID using `declare_id!`
2. Implements a single instruction called `initialize`
3. The `initialize` function logs a greeting message with the program ID
4. Returns a successful result

## Normal Deployment Flow

In a normal environment without connectivity issues, here's how you would deploy and interact with this program:

### 1. Build the Program

```bash
anchor build
```

This compiles your Rust program into BPF (Berkeley Packet Filter) bytecode that can run on the Solana runtime.

### 2. Deploy the Program

```bash
# Configure Solana CLI to use a network (localnet or devnet)
solana config set --url http://localhost:8899  # For local validator
# OR
solana config set --url https://api.devnet.solana.com  # For devnet

# Deploy the program
anchor deploy
```

This deploys your compiled program to the selected Solana network.

### 3. Interact with the Program

You would use a client (like the ones we've created) to:
- Connect to the Solana network
- Create a transaction that calls your program's `initialize` function
- Sign and send the transaction
- Process the response

## Understanding Program Accounts

Solana programs operate on accounts, which are owned by either users or programs:

1. **Program Account**: Contains the executable code (your Rust program compiled to BPF)
2. **Data Accounts**: Store state for your program

Your simple program doesn't create any data accounts, but more complex programs would.

## Troubleshooting Network Issues

### Local Validator Issues

The error `客户端没有所需的特权` (Client doesn't have required privileges) occurs because:
- Solana validator needs to create special files and access system resources
- On Windows, this requires administrator privileges

**Solutions:**
- Run Command Prompt as Administrator
- Use the `start-validator.bat` script we created (right-click and "Run as Administrator")

### Devnet Connection Issues

If you can't connect to devnet, it might be due to:
- Network firewall blocking the connection
- DNS issues
- Proxy settings

**Solutions:**
- Check your firewall settings
- Try using a VPN
- Ask your network administrator to allow connections to api.devnet.solana.com

### Anchor Build Issues

The error `Can't get home directory path: environment variable not found` occurs because:
- Anchor needs to know your home directory to store files
- The environment variable (HOME or USERPROFILE) is not set correctly

**Solutions:**
- Set the environment variable manually:
  ```
  set HOME=%USERPROFILE%
  ```
- Or create a batch file that sets this before running anchor commands

## Using the Mock Client

While resolving these issues, you can use our mock client to understand how the program works:

```bash
node mock-client.js
```

This simulates:
1. Connecting to a Solana network
2. Checking your wallet balance
3. Creating a transaction that calls your program
4. Sending and confirming the transaction
5. Processing the response

## Next Steps

Once you resolve the network issues, you can:
1. Deploy your program using `anchor deploy`
2. Use the real client (`simple-client.js`) to interact with your program
3. Extend your program with more functionality
4. Build a more sophisticated client application
