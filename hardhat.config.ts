import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";
import "@typechain/hardhat";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        "version": "0.6.0"
      },
      {
        "version": "0.8.9"
      },
    ]
  },
  typechain: {
    outDir: "./typechain"
  }
};

export default config;
