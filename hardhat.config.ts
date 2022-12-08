import * as dotenv from "dotenv";
import { HardhatUserConfig, extendEnvironment } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";
dotenv.config();

task("balance", "Prints an account's balance").setAction(async ({ ethers }) => {
  const [signer] = await ethers.getSigners();
  let balance = await ethers.provider.getBalance(signer.address);

  console.log(ethers.utils.formatEther(balance), "ETH");

  const linkContractAddr = "0x326c977e6efc84e512bb9c30f76e30c160ed06fb";
  const LINK_TOKEN_ABI = [
    {
      inputs: [
        { internalType: "address", name: "recipient", type: "address" },
        { internalType: "uint256", name: "amount", type: "uint256" },
      ],
      name: "transfer",
      outputs: [{ internalType: "bool", name: "", type: "bool" }],
      stateMutability: "nonpayable",
      type: "function",
    },
    {
      constant: true,
      inputs: [
        {
          name: "_owner",
          type: "address",
        },
      ],
      name: "balanceOf",
      outputs: [
        {
          name: "balance",
          type: "uint256",
        },
      ],
      payable: false,
      stateMutability: "view",
      type: "function",
    },
  ];
  const linkTokenContract = new ethers.Contract(
    linkContractAddr,
    LINK_TOKEN_ABI,
    signer
  );
  balance = await linkTokenContract.balanceOf(signer.address);
  console.log(ethers.utils.formatEther(balance), "LINK");
});

task("fund", "Funds a contract with LINK").setAction(
  async (_, { ethers, network, contractConfig }) => {
    const linkContractAddr = "0x326c977e6efc84e512bb9c30f76e30c160ed06fb";
    const contractAddr = contractConfig.contractAddress;
    const networkId = network.name;
    console.log(`Funding contract '${contractAddr}' on network '${networkId}'`);
    const LINK_TOKEN_ABI = [
      {
        inputs: [
          { internalType: "address", name: "recipient", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];

    //Fund with 1 LINK token
    const amount = ethers.utils.parseUnits("1.0");

    // Get signer information
    const accounts = await ethers.getSigners();
    const signer = accounts[0];

    // Create connection to LINK token contract and initiate the transfer
    const linkTokenContract = new ethers.Contract(
      linkContractAddr,
      LINK_TOKEN_ABI,
      signer
    );
    const result = await linkTokenContract
      .transfer(contractAddr, amount)
      .then(function (transaction: any) {
        console.log(
          `Contract '${contractAddr}' funded with 1 LINK at tx '${transaction.hash}'`
        );
      });
  }
);

task("set-url", "Sets contract request URL")
  .addParam("url", "The GET request URL")
  .setAction(async (taskArgs, { ethers, network, contractConfig }) => {
    const contractAddr = contractConfig.contractAddress;
    const url = taskArgs.url;
    const networkId = network.name;
    console.log(`Calling contract '${contractAddr}' on network '${networkId}'`);

    // Get signer information
    const accounts = await ethers.getSigners();
    const signer = accounts[0];

    // Create connection to contract and call the createRequestTo function
    const TableStateContract = await ethers.getContractFactory(
      "TableState",
      signer
    );
    const tableStateContract = await TableStateContract.attach(contractAddr);
    await tableStateContract
      .setRequestUrl(url)
      .then(function (transaction: any) {
        console.log(
          `Contract '${contractAddr}' url set to '${url}' at tx '${transaction.hash}'\n`
        );
        console.log(`Run the following to read the set url:`);
        console.log(`npx hardhat read-url --network ${networkId}`);
      });
  });

task("set-path", "Sets contract request path")
  .addParam("path", "The request path at the specified request URL")
  .setAction(async (taskArgs, { ethers, network, contractConfig }) => {
    const contractAddr = contractConfig.contractAddress;
    const path = taskArgs.path;
    const networkId = network.name;
    console.log(`Calling contract '${contractAddr}' on network '${networkId}'`);

    // Get signer information
    const accounts = await ethers.getSigners();
    const signer = accounts[0];

    // Create connection to contract and call the createRequestTo function
    const TableStateContract = await ethers.getContractFactory(
      "TableState",
      signer
    );
    const tableStateContract = await TableStateContract.attach(contractAddr);
    await tableStateContract
      .setRequestPath(path)
      .then(function (transaction: any) {
        console.log(
          `Contract '${contractAddr}' request url set to '${path}' at tx '${transaction.hash}'\n`
        );
        console.log(`Run the following to read the request path:`);
        console.log(`npx hardhat read-path --network ${networkId}`);
      });
  });

task("set-fee", "Sets contract fee paid to Chainlink node")
  .addParam("fee", "The Chainlink fee in gwei")
  .setAction(async (taskArgs, { ethers, network, contractConfig }) => {
    const contractAddr = contractConfig.contractAddress;
    const fee = taskArgs.fee;
    const networkId = network.name;
    console.log(`Calling contract '${contractAddr}' on network '${networkId}'`);

    // Get signer information
    const accounts = await ethers.getSigners();
    const signer = accounts[0];

    // Create connection to contract and call the createRequestTo function
    const TableStateContract = await ethers.getContractFactory(
      "TableState",
      signer
    );
    const tableStateContract = await TableStateContract.attach(contractAddr);
    await tableStateContract.setFee(fee).then(function (transaction: any) {
      console.log(
        `Contract '${contractAddr}' fee set successfully called at tx '${transaction.hash}'`
      );
    });
  });

task("read-url", "Read contract request URL").setAction(
  async (_, { ethers, network, contractConfig }) => {
    const contractAddr = contractConfig.contractAddress;

    const networkId = network.name;
    console.log(`Calling contract '${contractAddr}' on network '${networkId}'`);

    // Get signer information
    const accounts = await ethers.getSigners();
    const signer = accounts[0];

    // Create connection to contract and call the createRequestTo function
    const TableStateContract = await ethers.getContractFactory(
      "TableState",
      signer
    );
    const tableStateContract = await TableStateContract.attach(contractAddr);
    await tableStateContract.url().then(function (data: any) {
      console.log(`Url: ${data.toString()}`);
    });
  }
);

task("read-path", "Read contract request path").setAction(
  async (_, { ethers, network, contractConfig }) => {
    const contractAddr = contractConfig.contractAddress;
    const networkId = network.name;
    console.log(`Calling contract '${contractAddr}' on network '${networkId}'`);

    // Get signer information
    const accounts = await ethers.getSigners();
    const signer = accounts[0];

    // Create connection to contract and call the createRequestTo function
    const TableStateContract = await ethers.getContractFactory(
      "TableState",
      signer
    );
    const tableStateContract = await TableStateContract.attach(contractAddr);
    await tableStateContract.path().then(function (data: any) {
      console.log(`Path: '${data.toString()}'`);
    });
  }
);

task("request-data", "Calls contract to request external data").setAction(
  async (_, { ethers, network, contractConfig }) => {
    const contractAddr = contractConfig.contractAddress;
    const networkId = network.name;
    console.log(`Calling contract '${contractAddr}' on network '${networkId}'`);

    // Get signer information
    const accounts = await ethers.getSigners();
    const signer = accounts[0];

    // Create connection to contract and call the createRequestTo function
    const TableStateContract = await ethers.getContractFactory(
      "TableState",
      signer
    );
    const tableStateContract = await TableStateContract.attach(contractAddr);
    const tx = await tableStateContract.requestData();
    const rec = await tx.wait();
    const event = await rec.events.find(
      (e: any) => e.event === "ChainlinkRequested"
    );
    const [id] = await event.args;
    console.log(
      `Contract '${contractAddr}' external data request successfully called at tx '${rec.transactionHash}'.\nRequest ID: '${id}'\n`
    );
    console.log(`Run the following to read the returned result:`);
    console.log(`npx hardhat read-data --network ${networkId}`);
  }
);

task(
  "read-data",
  "Calls contract to read data obtained from an external API"
).setAction(async (_, { ethers, network, contractConfig }) => {
  const contractAddr = contractConfig.contractAddress;
  const networkId = network.name;
  console.log(
    `Reading data from contract '${contractAddr}' on network '${networkId}'`
  );

  // Get signer information
  const accounts = await ethers.getSigners();
  const signer = accounts[0];

  // Create connection to contract and call the createRequestTo function
  const TableStateContract = await ethers.getContractFactory(
    "TableState",
    signer
  );
  const tableStateContract = await TableStateContract.attach(contractAddr);
  const data = await tableStateContract.data();
  console.log(`Data: ${data.toNumber()}`);
});

task("withdraw", "Withdraws LINK from contract").setAction(
  async (_, { ethers, network, contractConfig }) => {
    const contractAddr = contractConfig.contractAddress;
    const networkId = network.name;
    console.log(`Calling contract '${contractAddr}' on network '${networkId}'`);

    // Get signer information
    const accounts = await ethers.getSigners();
    const signer = accounts[0];

    // Create connection to contract and call the createRequestTo function
    const TableStateContract = await ethers.getContractFactory(
      "TableState",
      signer
    );
    const tableStateContract = await TableStateContract.attach(contractAddr);
    const tx = await tableStateContract.withdrawLink();
    const rec = await tx.wait();
    console.log(
      `Successfully withdrew LINK from contract at tx '${rec.transactionHash}' and sent to: '${signer.address}'\n`
    );
    console.log(`Run the following to see your account balance:`);
    console.log(`npx hardhat balance --network ${networkId}`);
  }
);

export const config: HardhatUserConfig = {
  solidity: "0.8.17",
  etherscan: {
    apiKey: {
      goerli: process.env.ETHERSCAN_API_KEY || "",
    },
  },
  networks: {
    "ethereum-goerli": {
      url: `https://eth-goerli.g.alchemy.com/v2/${
        process.env.ETHEREUM_GOERLI_API_KEY ?? ""
      }`,
      accounts:
        process.env.ETHEREUM_GOERLI_PRIVATE_KEY !== undefined
          ? [process.env.ETHEREUM_GOERLI_PRIVATE_KEY]
          : [],
    },
  },
  config: {
    args: { contractAddress: "0xbb7051B5fC1B713dacf4AdFa20b22F6B43B184d2" }, // Update this with each deployment
  },
};

interface ContractConfig {
  contractAddress: string;
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
    contractConfig: ContractConfig;
  }
}

extendEnvironment((hre: HardhatRuntimeEnvironment) => {
  // Get configs for user-selected network
  const config = hre.userConfig.config;
  hre.contractConfig = config.args;
});

export default config;
