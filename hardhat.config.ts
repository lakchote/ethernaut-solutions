import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-ethers";

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
  }
};

export default config;
