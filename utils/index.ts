import { Cluster, clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { message } from "antd";

// implementing a function that gets an account's balance
const refreshBalance = async (network: Cluster | undefined, account: Keypair | null) => {
  // This line ensures the function returns before running if no account has been set
  if (!account) return 0;

  try {
    const connection = new Connection(clusterApiUrl(network), "confirmed");  // initiates a new connection with the solana network

    // get the public key
    const publicKey = account.publicKey;

    // get the account's balance using the connection instance
    const balance = await connection.getBalance(publicKey);

    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";
    message.error(`Balance refresh failed: ${errorMessage}`);
    return 0;
  }
};

// implementing a function that airdrops SOL into devnet account
const handleAirdrop = async (network: Cluster, account: Keypair | null) => {
  // This line ensures the function returns before running if no account has been set
  if (!account) return;

  try {
    // (b) instantiate a connection using clusterApiUrl with the active network passed in as an argument
    const connection = new Connection(clusterApiUrl(network), "confirmed");

    // (c) get the key using one of the accessors on the account passed in as an argument
    const publicKey = account.publicKey;

    // (d) request the airdrop using the connection instance
    // Note that you should include the amount to airdrop (consider using the LAMPORTS_PER_SOL constant from the web3.js library)
    const confirmation = await connection.requestAirdrop(publicKey, LAMPORTS_PER_SOL);

    // (d) confirm the transaction using the connection instance and the confirmation string returned from the airdrop
    const result = await connection.confirmTransaction(confirmation, "confirmed");

    // This line returns the balance after the airdrop so the UI can be refreshed
    return await refreshBalance(network, account);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown Error";
    message.error(`Airdrop failed: ${errorMessage}`);
  }
};

export { refreshBalance, handleAirdrop };
