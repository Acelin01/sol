import * as web3 from '@solana/web3.js';
import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Load the IDL file
const idlFile = path.join(__dirname, '../target/idl/test.json');
const idl = JSON.parse(fs.readFileSync(idlFile, 'utf8'));

// Program ID from the declare_id! in lib.rs
const PROGRAM_ID = new web3.PublicKey('FeiNMM9u1p1nWbjsBqNFoEvEfXkngxebMX3aA5GMvePN');

async function main() {
  // Connect to the Solana devnet
  const connection = new web3.Connection('https://api.devnet.solana.com', 'confirmed');
  
  // Set up the wallet - using the explicit keypair path
  const walletKeyPath = 'C:\\Users\\1\\.config\\solana\\id.json';
  const walletKeypair = web3.Keypair.fromSecretKey(
    Buffer.from(JSON.parse(fs.readFileSync(walletKeyPath, 'utf8')))
  );
  const wallet = new anchor.Wallet(walletKeypair);
  
  // Create the provider
  const provider = new anchor.AnchorProvider(
    connection,
    wallet,
    { commitment: 'confirmed' }
  );
  
  // Create the program interface
  const program = new Program(idl, PROGRAM_ID, provider);
  
  console.log('Program ID:', program.programId.toString());
  
  try {
    // Call the initialize function
    const tx = await program.methods
      .initialize()
      .accounts({})
      .rpc();
    
    console.log('Transaction signature:', tx);
    
    // Fetch the transaction details
    const txDetails = await connection.getTransaction(tx, {
      commitment: 'confirmed',
    });
    
    console.log('Transaction details:', txDetails);
  } catch (error) {
    console.error('Error:', error);
  }
}

main().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);
