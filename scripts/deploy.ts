import "@nomiclabs/hardhat-ethers";
import { ethers, network, deployment } from "hardhat";

async function main() {
  // Get the deploying account
  const [account] = await ethers.getSigners();
  console.log("\nDeploying TableState...");
  // Deploy the `TableState` contract
  const TableState = await ethers.getContractFactory("TableState", account);
  const tableState = await TableState.deploy(
    deployment.linkTokenAddress,
    deployment.oracleAddress,
    ethers.utils.toUtf8Bytes(deployment.jobId) // Must convert the string to `bytes32`
  );
  await tableState.deployed();
  console.log(`Contract 'TableState' deployed to: ${tableState.address}`);

  // Define the table in which Chainlink should make an API request to -- e.g., the `healthbot` table
  const { chainId } = await ethers.provider.getNetwork();
  const tableName = `healthbot_${chainId}_1`; // The `healthbot` table is always the first table minted, hence, the `1` suffix

  // Define the Tableland gateway URL to make a query at: SELECT * FROM healthbot_{chainId}_1
  const url = `https://testnets.tableland.network/api/v1/query?unwrap=true&statement=select%20%2A%20from%20${tableName}`;
  // Set the request `url` and `path` variables in the contract
  let tx = await tableState.setRequestUrl(url);
  await tx.wait();
  console.log(`URL set to: '${url}'`);
  const path = "counter";
  tx = await tableState.setRequestPath(path);
  await tx.wait();
  console.log(`Path set to: '${path}'`);

  // Fund the contract with LINK
  const linkContractAddr = deployment.linkTokenAddress; // Ethereum Sepolia LINK token address
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
  // Specify 3 LINK tokens for funding
  const amount = ethers.utils.parseUnits("3.0");
  // Create connection to LINK token contract and initiate the transfer
  const linkTokenContract = new ethers.Contract(
    linkContractAddr,
    LINK_TOKEN_ABI,
    account
  );
  await linkTokenContract
    .connect(account)
    .transfer(contractAddr, amount)
    .then(function (transaction: any) {
      console.log(
        `Contract ${contractAddr} funded with 3 LINK. Transaction Hash: ${transaction.hash}`
      );
    });

  // Log possible tasks, the first of which interact with Chainlink
  console.log("\nRun the first two tasks to request and read table data:");
  console.log("\n---------------------------------");
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
  console.log("\nSet the LINK default fee amount:");
  console.log(`npx hardhat set-fee --fee <value> --network ${networkId}`);
  console.log("\nSet the LINK token address:");
  console.log(`npx hardhat set-link --address <value> --network ${networkId}`);
  console.log("\nWithdraw LINK:");
  console.log(`npx hardhat withdraw --network ${networkId}`);
  console.log("\nSee all available tasks with:");
  console.log("npx hardhat");
  console.log("\n---------------------------------");
  console.log(
    `\nBe sure to save contract address for 'TableState' in 'hardhat.config.ts':\n'${tableState.address}'\n`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
