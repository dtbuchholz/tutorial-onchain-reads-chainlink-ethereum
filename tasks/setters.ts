import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";

task("set-url", "Sets contract request URL")
  .addParam("url", "The GET request URL")
  .setAction(async (taskArgs, { ethers, network, deployment }) => {
    const contractAddr = deployment.contractAddress;
    const url = taskArgs.url;
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
    await tableStateContract
      .setRequestUrl(url)
      .then(function (transaction: any) {
        console.log(
          `Contract '${contractAddr}' url set to '${url}' at tx '${transaction.hash}'\n`
        );
        console.log(`Run the following to read the set url:`);
        console.log(`npx hardhat read-url --network ${networkName}`);
      });
  });

task("set-path", "Sets contract request path")
  .addParam("path", "The request path at the specified request URL")
  .setAction(async (taskArgs, { ethers, network, deployment }) => {
    const contractAddr = deployment.contractAddress;
    const path = taskArgs.path;
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
    await tableStateContract
      .setRequestPath(path)
      .then(function (transaction: any) {
        console.log(
          `Contract '${contractAddr}' request url set to '${path}' at tx '${transaction.hash}'\n`
        );
        console.log(`Run the following to read the request path:`);
        console.log(`npx hardhat read-path --network ${networkName}`);
      });
  });

task("set-fee", "Sets contract fee paid to Chainlink node")
  .addParam("fee", "The Chainlink fee in gwei")
  .setAction(async (taskArgs, { ethers, network, deployment }) => {
    const contractAddr = deployment.contractAddress;
    const fee = taskArgs.fee;
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
    await tableStateContract.setFee(fee).then(function (transaction: any) {
      console.log(
        `Contract '${contractAddr}' fee set successfully called at tx '${transaction.hash}'`
      );
    });
  });

task("set-link", "Sets Chainlink LINK token address")
  .addParam("address", "The LINK address")
  .setAction(async (taskArgs, { ethers, network, deployment }) => {
    const contractAddr = deployment.contractAddress;
    const address = taskArgs.address;
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
    await tableStateContract
      .setLinkToken(address)
      .then(function (transaction: any) {
        console.log(
          `LINK address '${address}' set at tx '${transaction.hash}'`
        );
      });
  });
