import "@nomiclabs/hardhat-ethers";
import { ethers, network } from "hardhat";

async function main() {
  const [account] = await ethers.getSigners();
  console.log("\nDeploying TableState...");
  const TableState = await ethers.getContractFactory("TableState", account);
  const tableState = await TableState.deploy();
  await tableState.deployed();
  console.log(`Contract 'TableState' deployed to: ${tableState.address}`);

  const url =
    "https://testnets.tableland.network/query?unwrap=true&s=select%20%2A%20from%20healthbot_5_1";
  let tx = await tableState.setRequestUrl(url);
  await tx.wait();
  console.log(`URL set to: '${url}'`);
  const path = "counter";
  tx = await tableState.setRequestPath(path);
  await tx.wait();
  console.log(`Path set to: '${path}'`);

  // Fund the contract with LINK
  const linkContractAddr = "0x326c977e6efc84e512bb9c30f76e30c160ed06fb"; // ETH Goerli
  const contractAddr = tableState.address;
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
  // Specify 5 LINK tokens for funding
  const amount = ethers.utils.parseUnits("5.0");
  // Get signer information
  const accounts = await ethers.getSigners();
  const signer = accounts[0];
  // Create connection to LINK token contract and initiate the transfer
  const linkTokenContract = new ethers.Contract(
    linkContractAddr,
    LINK_TOKEN_ABI,
    signer
  );
  await linkTokenContract
    .transfer(contractAddr, amount)
    .then(function (transaction: any) {
      console.log(
        `Contract ${contractAddr} funded with 5 LINK. Transaction Hash: ${transaction.hash}`
      );
    });
  // Log possible tasks
  console.log("\n---------------------------------");
  console.log("\nRun the following tasks:");
  console.log("\nRequest new data at the URL + path:");
  console.log(`npx hardhat request-data --network ${networkId}`);
  console.log("\nRead the data from the contract:");
  console.log(`npx hardhat read-data --network ${networkId}`);
  console.log("\n---------------------------------");
  console.log("\nFund the contract with 1 LINK:");
  console.log(`npx hardhat fund-link --network ${networkId}`);
  console.log("\nSet the request URL:");
  console.log(`npx hardhat set-url --url <value> --network ${networkId}`);
  console.log(`\nGet the request URL: `);
  console.log(`npx hardhat read-url --network ${networkId}`);
  console.log("\nSet the request path:");
  console.log(`npx hardhat set-path --path <value> --network ${networkId}`);
  console.log("\nGet the request path:");
  console.log(`npx hardhat read-path --network ${networkId}`);
  console.log("\nWithdraw LINK:");
  console.log(`npx hardhat withdraw --network ${networkId}`);
  console.log("\n---------------------------------");
  console.log(
    `\nBe sure to save contract address for 'TableState' in 'hardhat.config.ts':\n'${tableState.address}'\n`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
