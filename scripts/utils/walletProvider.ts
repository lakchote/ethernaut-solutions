import { Provider } from "@ethersproject/providers";
import { Signer } from "ethers";
import { ethers } from "hardhat";

function getSigner(): Signer {
  // Do not send funds there otherwise hackers will steal it
  const EXPOSED_KEY =
    "8da4ef21b864d2cc526dbdb2a120bd2874c36c9d0a1fb7f8c63d7f7a8b41de8f";
  const DEFAULT_NETWORK = "ropsten";

  const options = {};
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? EXPOSED_KEY);
  const provider = ethers.providers.getDefaultProvider(
    DEFAULT_NETWORK,
    options
  );

  console.log(
    `Connecting ${wallet.address} to provider for network ${DEFAULT_NETWORK}...`
  );

  return wallet.connect(provider);
}

export { getSigner };
