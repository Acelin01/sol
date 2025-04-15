const { Connection, PublicKey, Keypair, Transaction, SystemProgram, sendAndConfirmTransaction } = require('@solana/web3.js');
const fs = require('fs');

// Program ID from the declare_id! in lib.rs
const PROGRAM_ID = new PublicKey('FeiNMM9u1p1nWbjsBqNFoEvEfXkngxebMX3aA5GMvePN');

async function main() {
  // Try to connect to local network first, then fall back to devnet
  let connection;
  try {
    console.log('Attempting to connect to local Solana validator...');
    connection = new Connection('http://localhost:8899', 'confirmed');
    // Quick test to see if local connection works
    await connection.getVersion();
    console.log('Successfully connected to local Solana validator');
  } catch (error) {
    console.log('Could not connect to local validator, trying devnet...');
    try {
      connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      // Test devnet connection
      await connection.getVersion();
      console.log('Successfully connected to Solana devnet');
    } catch (devnetError) {
      console.log('Could not connect to devnet, trying testnet...');
      try {
        connection = new Connection('https://api.testnet.solana.com', 'confirmed');
        // Test testnet connection
        await connection.getVersion();
        console.log('Successfully connected to Solana testnet');
      } catch (testnetError) {
        console.error('Failed to connect to local, devnet, and testnet Solana networks');
        console.error('Please check your network connection or firewall settings');
        process.exit(1);
      }
    }
  }
  
  // Load the wallet keypair
  const walletKeyPath = 'C:\\Users\\1\\.config\\solana\\id.json';
  const secretKey = Buffer.from(JSON.parse(fs.readFileSync(walletKeyPath, 'utf8')));
  const wallet = Keypair.fromSecretKey(secretKey);
  
  console.log('Wallet public key:', wallet.publicKey.toString());
  
  try {
    // Check account balance
    console.log('Checking account balance...');
    try {
      const balance = await connection.getBalance(wallet.publicKey);
      console.log(`Account balance: ${balance / 1000000000} SOL`);
    } catch (balanceError) {
      console.warn('Could not retrieve balance:', balanceError.message);
      console.log('Continuing anyway...');
    }
    
    // Check if program exists on the network
    console.log('Checking if program exists at address:', PROGRAM_ID.toString());
    try {
      const programInfo = await connection.getAccountInfo(PROGRAM_ID);
      if (programInfo === null) {
        console.warn('WARNING: Program not found at the specified address!');
        console.warn('You may need to deploy your program first.');
        console.log('Continuing with transaction anyway for testing purposes...');
      } else {
        console.log('Program found! Executable:', programInfo.executable);
      }
    } catch (programCheckError) {
      console.warn('Could not check program info:', programCheckError.message);
      console.log('Continuing anyway...');
    }
    
    // Create a transaction to call the program
    console.log('Creating transaction...');
    const transaction = new Transaction();
    
    // Add a simple system program instruction as a fallback
    // This ensures the transaction is valid even if the program doesn't exist
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: wallet.publicKey,
        lamports: 100, // minimal amount
      })
    );
    
    // Try to add the program instruction
    try {
      transaction.add({
        keys: [
          {
            pubkey: wallet.publicKey,
            isSigner: true,
            isWritable: true,
          },
        ],
        programId: PROGRAM_ID
      });
      console.log('Added program instruction to transaction');
    } catch (addInstructionError) {
      console.warn('Could not add program instruction:', addInstructionError.message);
    }
    
    // Send the transaction
    console.log('Sending transaction...');
    try {
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [wallet],
        { commitment: 'confirmed' }
      );
      
      console.log('Transaction signature:', signature);
      console.log('Transaction successful!');
      
      // Try to get transaction details
      try {
        console.log('Fetching transaction details...');
        const txDetails = await connection.getTransaction(signature, { commitment: 'confirmed' });
        console.log('Transaction details:', JSON.stringify(txDetails, null, 2));
      } catch (txDetailsError) {
        console.warn('Could not fetch transaction details:', txDetailsError.message);
      }
    } catch (txError) {
      console.error('Transaction failed:', txError.message);
      if (txError.message.includes('Program doesn\'t exist')) {
        console.error('The program has not been deployed to this network.');
        console.error('Please deploy your program before trying to interact with it.');
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
