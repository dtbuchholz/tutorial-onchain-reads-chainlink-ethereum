import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";

task("request-data", "Calls contract to request external data").setAction(
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
    // Make a request to Chainlink to fetch the Tableland table data
    const tx = await tableStateContract.requestData();
    const rec = await tx.wait();
    const event = rec.events?.find(
      (e: any) => e.event === "ChainlinkRequested"
    );
    const [id] = [...(event?.args || [])];
    console.log(
      `Contract '${contractAddr}' external data request successfully called at tx '${rec.transactionHash}'.\nRequest ID: '${id}'\n`
    );
    console.log(`Run the following to read the returned result:`);
    console.log(`npx hardhat read-data --network ${networkName}`);
  }
);

task(
  "read-data",
  "Calls contract to read data obtained from an external API"
).setAction(async (_, { ethers, network, deployment }) => {
  const contractAddr = deployment.contractAddress;
  const networkName = network.name;
  console.log(
    `Reading data from contract '${contractAddr}' on network '${networkName}'`
  );
  // Get signer information
  const [account] = await ethers.getSigners();
  // Create connection to contract and call the createRequestTo function
  const TableStateContract = await ethers.getContractFactory(
    "TableState",
    account
  );
  const tableStateContract = TableStateContract.attach(contractAddr);
  // Read the on-chain table state data
  const data = await tableStateContract.data();
  console.log(`Data: ${data.toNumber()}`);
});

task("read-url", "Read contract request URL").setAction(
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
    // Retrieve the request URL (e.g., Tableland gateway)
    await tableStateContract.url().then(function (data: any) {
      console.log(`Url: ${data.toString()}`);
    });
  }
);

task("read-path", "Read contract request path").setAction(
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
    // Retrieve the request "path" the was set during deployment
    await tableStateContract.path().then(function (data: any) {
      console.log(`Path: '${data.toString()}'`);
    });
  }
);
