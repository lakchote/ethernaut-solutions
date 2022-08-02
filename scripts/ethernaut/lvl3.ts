import { ethers } from "hardhat";

/**
 * The vulnerability in level 3 lies in the pseudo-randomness flip() function.
 * 
 * Pseudo-randomness is a common and critical problem in blockchain given its properties.
 * 
 * We can correctly guess the right outcome simply by replicating the contract's pseudo-random algorithm which is public.
 */
async function main() {
  let cntOutcomes = 0;
  const contractFactory = await ethers.getContractFactory("Lvl3");
  console.log("Deploying contract...");
  const contract = await contractFactory.deploy();
  console.log("Awaiting confirmations...");
  await contract.deployed();
  console.log(`Contract deployed locally at ${contract.address}`);

  const previousConsecutiveWins = await contract.consecutiveWins();
  console.log(`Previous consecutive wins : ${previousConsecutiveWins}`);
  const divFactorForCoinFlip = ethers.BigNumber.from(
    "57896044618658097711785492504343953926634992332820282019728792003956564819968"
  );

  while (cntOutcomes < 10) {
    const lastBlockHash = (await ethers.provider.getBlock("latest")).hash;
    console.log(`Last block hash : ${lastBlockHash}`);
    const lastBlockHashUint = ethers.BigNumber.from(lastBlockHash);
    const coinFlipResult = lastBlockHashUint.div(
      ethers.BigNumber.from(divFactorForCoinFlip)
    );

    const guessToMake = coinFlipResult.eq(1) ? true : false;
    console.log(
      `Calling flip() on the contract with ${guessToMake} as the guess...`
    );
    const flipTx = await contract.flip(guessToMake);
    await flipTx.wait();
    const currentConsecutiveWins = await contract.consecutiveWins();
    console.log(`Current consecutive wins : ${currentConsecutiveWins}`);
    cntOutcomes++;
  }
  console.log("🥷 Successfully guessed the correct outcome 10 times in a row.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
