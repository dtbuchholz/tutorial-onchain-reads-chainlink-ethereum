import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import "@nomicfoundation/hardhat-toolbox";

task("balance", "Prints an account's balance").setAction(
  async (_, { ethers, deployment }) => {
    const [account] = await ethers.getSigners();
    const contractAddr = deployment.contractAddress;
    // Log the balance of ETH
    const ethBalance = await ethers.provider.getBalance(account.address);
    // Log the balance of the LINK token, first connecting to the contract
    const linkContractAddr = deployment.linkTokenAddress;
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
      account
    );
    let balance = await linkTokenContract.balanceOf(account.address);
    console.log(
      "Wallet:",
      ethers.utils.formatEther(ethBalance).slice(0, 7),
      "ETH,",
      ethers.utils.formatEther(balance),
      "LINK"
    );
    balance = await linkTokenContract.balanceOf(contractAddr);
    console.log("Contract:", ethers.utils.formatEther(balance), "LINK");
  }
);

task("fund", "Funds a contract with LINK").setAction(
  async (_, { ethers, network, deployment }) => {
    const linkContractAddr = deployment.linkTokenAddress;
    const contractAddr = deployment.contractAddress;
    const networkName = network.name;
    console.log(
      `Funding contract '${contractAddr}' on network '${networkName}'`
    );
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
    // Fund with 1 LINK token
    const amount = ethers.utils.parseUnits("1.0");
    // Get signer information
    const [account] = await ethers.getSigners();
    // Create connection to LINK token contract and initiate the transfer
    const linkTokenContract = new ethers.Contract(
      linkContractAddr,
      LINK_TOKEN_ABI,
      account
    );
    await linkTokenContract
      .transfer(contractAddr, amount)
      .then(function (transaction: any) {
        console.log(
          `Contract '${contractAddr}' funded with 1 LINK at tx '${transaction.hash}'`
        );
      });
  }
);

task("withdraw", "Withdraws LINK from contract").setAction(
  async (_, { ethers, network, deployment }) => {
    const contractAddr = deployment.contractAddress;
    const networkName = network.name;
    console.log(
      `Calling contract '${contractAddr}' on network '${networkName}'`
    );
    // Get signer information
    const [account] = await ethers.getSigners();
    // Create connection to contract and call the createRequestTo function
    const TableStateContract = await ethers.getContractFactory(
      "TableState",
      account
    );
    const tableStateContract = TableStateContract.attach(contractAddr);
    const tx = await tableStateContract.withdrawLink();
    const rec = await tx.wait();
    console.log(
      `Successfully withdrew LINK from contract at tx '${rec.transactionHash}' and sent to: '${account.address}'\n`
    );
    console.log(`Run the following to see your account balance:`);
    console.log(`npx hardhat balance --network ${networkName}`);
  }
);
