import * as dotenv from "dotenv";
import { HardhatUserConfig, extendEnvironment } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import "./tasks/index";
dotenv.config();

export const config: HardhatUserConfig = {
  solidity: "0.8.17",
  etherscan: {
    apiKey: {
      arbitrumGoerli: process.env.ARBISCAN_API_KEY || "",
    },
  },
  networks: {
    "arbitrum-goerli": {
      url: `https://arb-goerli.g.alchemy.com/v2/${
        process.env.ARBITRUM_GOERLI_API_KEY ?? ""
      }`,
      accounts:
        process.env.ARBITRUM_GOERLI_PRIVATE_KEY !== undefined
          ? [process.env.ARBITRUM_GOERLI_PRIVATE_KEY]
          : [],
    },
  },
  config: {
    args: {
      contractAddress: "0x383f1BAA132Cea7CFfb2780f2935deD0f8e7E654", // IMPORTANT: Update this with each deployment
      linkTokenAddress: "0xd14838A68E8AFBAdE5efb411d5871ea0011AFd28", // Arbitrum Goerli LINK token
      oracleAddress: "0x2362A262148518Ce69600Cc5a6032aC8391233f5", // Translucent (node operator) address -- see: https://translucent.link/products/get-uint256)
      jobId: "7599d3c8f31e4ce78ad2b790cbcfc673", // Translucent job ID for single word uint256 request
    },
  },
};

interface ContractConfig {
  contractAddress: string;
  linkTokenAddress: string;
  oracleAddress: string;
  jobId: string;
}

interface ContractNetworkConfig {
  args: ContractConfig;
}

declare module "hardhat/types/config" {
  // eslint-disable-next-line no-unused-vars
  interface HardhatUserConfig {
    config: ContractNetworkConfig;
  }
}

declare module "hardhat/types/runtime" {
  // eslint-disable-next-line no-unused-vars
  interface HardhatRuntimeEnvironment {
    deployment: ContractConfig;
  }
}

extendEnvironment((hre: HardhatRuntimeEnvironment) => {
  // Get configs for user-selected network
  const config = hre.userConfig.config;
  hre.deployment = config.args;
});

export default config;
