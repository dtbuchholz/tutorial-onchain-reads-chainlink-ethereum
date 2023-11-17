import * as dotenv from "dotenv";
import { HardhatUserConfig, extendEnvironment } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import "./tasks/index";
dotenv.config();

export const config: HardhatUserConfig = {
  solidity: "0.8.17",
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY || "",
    },
  },
  networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${
        process.env.ETHEREUM_SEPOLIA_API_KEY ?? ""
      }`,
      accounts:
        process.env.ETHEREUM_SEPOLIA_PRIVATE_KEY !== undefined
          ? [process.env.ETHEREUM_SEPOLIA_PRIVATE_KEY]
          : [],
    },
  },
  config: {
    args: {
      contractAddress: "0x22352F3c7765D389f2491108942de357f799Ec4F", // IMPORTANT: Update this with each deployment
      linkTokenAddress: "0x779877A7B0D9E8603169DdbD7836e478b4624789", // Ethereum Sepolia LINK token
      oracleAddress: "0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD", // Any API node operator address
      jobId: "ca98366cc7314957b8c012c72f05aeeb",
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
