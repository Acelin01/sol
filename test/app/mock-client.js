
/**
 * Mock Solana Client - Simulates interaction with the Solana program
 * 
 * This client demonstrates how the interaction with your Solana program would work
 * without requiring an actual connection to a Solana network.
 */

// Mock program ID (matches your actual program ID)
const PROGRAM_ID = 'FeiNMM9u1p1nWbjsBqNFoEvEfXkngxebMX3aA5GMvePN';

// Mock wallet
const wallet = {
  publicKey: 'Bgta67F85bu42eD9hrMGrfL627CSRui15WjLdcAFmwZc',
  secretKey: '[simulated secret key]'
};

// Mock Solana connection
class MockConnection {
  constructor(endpoint, commitment) {
    this.endpoint = endpoint;
    this.commitment = commitment;
    console.log(`Connected to mock Solana network at ${endpoint}`);
  }

  async getBalance(publicKey) {
    console.log(`Getting balance for ${publicKey}...`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    // Return mock balance (2 SOL)
    return 2000000000;
  }

  async getAccountInfo(publicKey) {
    console.log(`Getting account info for ${publicKey}...`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (publicKey === PROGRAM_ID) {
      // Simulate program info
      return {
        executable: true,
        owner: 'BPFLoaderUpgradeab1e11111111111111111111111',
        lamports: 1000000000,
        data: Buffer.from('mock program data')
      };
    }
    return null;
  }

  async sendTransaction(transaction, signers, options) {
    console.log('Sending transaction...');
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock transaction signature
    const signature = 'mock_' + Math.random().toString(36).substring(2, 15);
    console.log(`Transaction sent with signature: ${signature}`);
    return signature;
  }

  async confirmTransaction(signature, commitment) {
    console.log(`Confirming transaction ${signature}...`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    return { value: { err: null } };
  }

  async getTransaction(signature) {
    console.log(`Getting transaction details for ${signature}...`);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Return mock transaction details
    return {
      meta: {
        err: null,
        fee: 5000,
        postBalances: [1999995000, 0],
        preBalances: [2000000000, 0],
        status: { Ok: null }
      },
      transaction: {
        message: {
          accountKeys: [wallet.publicKey, PROGRAM_ID],
          instructions: [
            {
              programId: PROGRAM_ID,
              accounts: [wallet.publicKey],
              data: 'mock instruction data'
            }
          ],
          recentBlockhash: 'mock_blockhash'
        },
        signatures: [signature]
      }
    };
  }
}

// Mock Transaction class
class MockTransaction {
  constructor() {
    this.instructions = [];
  }

  add(instruction) {
    this.instructions.push(instruction);
    return this;
  }
}

// Mock SystemProgram
const MockSystemProgram = {
  transfer: ({ fromPubkey, toPubkey, lamports }) => {
    return {
      programId: 'SystemProgram11111111111111111111111111111111',
      keys: [
        { pubkey: fromPubkey, isSigner: true, isWritable: true },
        { pubkey: toPubkey, isSigner: false, isWritable: true }
      ],
      data: `Transfer ${lamports} lamports`
    };
  }
};

// Mock sendAndConfirmTransaction function
async function mockSendAndConfirmTransaction(connection, transaction, signers, options) {
  const signature = await connection.sendTransaction(transaction, signers, options);
  await connection.confirmTransaction(signature);
  return signature;
}

// Main function
async function main() {
  console.log('=== MOCK SOLANA CLIENT ===');
  console.log('This client simulates interaction with your Solana program');
  console.log('Program ID:', PROGRAM_ID);
  console.log('Wallet public key:', wallet.publicKey);
  console.log('----------------------------');
  
  // Create mock connection
  const connection = new MockConnection('http://localhost:8899', 'confirmed');
  
  try {
    // Check account balance
    console.log('\n1. Checking account balance...');
    const balance = await connection.getBalance(wallet.publicKey);
    console.log(`Account balance: ${balance / 1000000000} SOL`);
    
    // Check if program exists
    console.log('\n2. Checking if program exists...');
    const programInfo = await connection.getAccountInfo(PROGRAM_ID);
    if (programInfo) {
      console.log('Program found! Executable:', programInfo.executable);
    } else {
      console.log('Program not found. You need to deploy it first.');
    }
    
    // Create and send transaction
    console.log('\n3. Creating transaction...');
    const transaction = new MockTransaction();
    
    // Add a system program instruction (transfer to self)
    transaction.add(
      MockSystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: wallet.publicKey,
        lamports: 100
      })
    );
    
    // Add program instruction
    transaction.add({
      programId: PROGRAM_ID,
      keys: [
        {
          pubkey: wallet.publicKey,
          isSigner: true,
          isWritable: true
        }
      ],
      data: 'initialize'
    });
    
    console.log('Transaction created with 2 instructions:');
    console.log('- System Program transfer (100 lamports)');
    console.log('- Program instruction (initialize)');
    
    // Send transaction
    console.log('\n4. Sending transaction...');
    const signature = await mockSendAndConfirmTransaction(
      connection,
      transaction,
      [wallet],
      { commitment: 'confirmed' }
    );
    
    console.log('Transaction successful!');
    console.log('Signature:', signature);
    
    // Get transaction details
    console.log('\n5. Fetching transaction details...');
    const txDetails = await connection.getTransaction(signature);
    console.log('Transaction status:', txDetails.meta.status.Ok === null ? 'Success' : 'Failed');
    console.log('Fee paid:', txDetails.meta.fee / 1000000000, 'SOL');
    
    console.log('\n=== SIMULATION COMPLETE ===');
    console.log('In a real environment, this client would:');
    console.log('1. Connect to a Solana network (localnet, devnet, testnet, or mainnet)');
    console.log('2. Use your actual wallet to sign transactions');
    console.log('3. Call the initialize function in your program at:', PROGRAM_ID);
    console.log('4. Process the response from your program');
    
  } catch (error) {
    console.error('Error:', error);
  }
}

// Run the main function
main().then(
  () => console.log('\nMock client execution completed successfully'),
  (err) => console.error('Mock client execution failed:', err)
);
