# TableState

Onchain table state using Chainlink's [Any API](https://docs.chain.link/getting-started/advanced-tutorial/) and Ethereum (Sepolia).

## Table of Contents

- [Background](#background)
  - [Overview](#overview)
  - [Project Structure](#project-structure)
- [Usage](#usage)
  - [Setup](#setup)
  - [Deployment](#deployment)
  - [Tasks](#tasks)
- [Output](#output)

## Background

### Overview

This project demonstrates how to query offchain Tableland table state and get data back onchain. It leverages Chainlink's Oracle network to fulfill onchain requests at the Tableland gateway and write the data back to the smart contract, allowing for onchain reads to take place. Ethereum's Sepolia testnet is also used to demonstrate how to use Chainlink in a testnet environment.

This example hard codes the Chainlink Oracle and contract info for the Ethereum Sepolia network. Note this is a ["single word"](https://docs.chain.link/any-api/get-request/examples/single-word-response/) response of a `uint256`, but others are possible (see [Any API docs](https://docs.chain.link/any-api/introduction)). The [Oracle](https://docs.chain.link/any-api/testnet-oracles/) used here is also for Ethereum Sepolia.

For a full walkthrough, see the documentation [here](https://docs.tableland.xyz/tutorials/table-reads-chainlink).

### Project Structure

The final output of this project produces the following:

- `tasks` => Holds a number of useful tasks, including requesting and reading offchain table data.
- `scripts` => Deploy and/or verify the `TableState` contract.

```markdown
├── contracts
│ └── TableState.sol
├── hardhat.config.ts
├── package-lock.json
├── package.json
├── scripts
│ ├── deploy.ts
│ └── verify.ts
├── tasks
│ ├── admin.ts
│ ├── index.ts
│ ├── requests.ts
│ └── setters.ts
├── tsconfig.json
└── .env
```

## Usage

### Setup

Before getting started, be sure to update the values in a `.env` file as well as sign up for an [Alchemy](https://alchemy.com/) and [Etherscan](https://etherscan.io/myapikey) account:

```
# Account private key
ETHEREUM_SEPOLIA_PRIVATE_KEY=fixme
# Alchemy API key
ETHEREUM_SEPOLIA_API_KEY=fixme
# Etherscan API key (contract verification)
ETHERSCAN_API_KEY=fixme
```

### Deployment

Deploy the contract, where the `url` and `path` are set within the `deploy` script and also available as tasks, if needed. Make sure that before you deploy the contract, you have [testnet LINK in your wallet](https://faucets.chain.link/sepolia). The deploy script handles a bunch of actions, including funding the contract with LINK, setting the request URL and path, and making a request to the Tableland gateway for the Chainlink Oracle to fulfill.

Run the deploy script with `npm run deploy`, which under the hood runs:

```
npx hardhat run scripts/deploy.ts --network sepolia
```

Upon deploying, save the value of the contract is `hardhat.configs.ts`, under the `config` field's `contractAddress` key. Below is an example of what this should look like. Keep in mind that each official Chainlink node should implement data transformation parameters the same across networks (e.g., `req.addInt("times", ...)`).

```javascript
...
config: {
  args: {
    contractAddress: "", // IMPORTANT: Update with deployed contract
    linkTokenAddress: "0x779877A7B0D9E8603169DdbD7836e478b4624789", // Ethereum Sepolia LINK token
    oracleAddress: "0x6090149792dAAeE9D1D568c9f9a6F6B46AA29eFD", // Any API node operator address
    jobId: "ca98366cc7314957b8c012c72f05aeeb" // Job ID for single word uint256 request
  }
}
...
```

Then, you can (optionally) verify the contract with `npm run verify`, assuming you've set up an Etherscan API key in your `.env` file. Under the hood, this will run:

```
npx hardhat run scripts/verify.ts --network sepolia
```

### Tasks

A number of tasks are included. Some simply read onchain data, and others cause state to be overwritten. All tasks can be listed with the command `npx hardhat`.

Make a request to the Tableland gateway for the Chainlink Oracle to fulfill:

```
npx hardhat request-data --network sepolia
```

Read the associated response that's written back onchain:

```
npx hardhat read-data --network sepolia
```

Try running some of the other tasks:

```
Fund the contract with 1 LINK:
npx hardhat fund-link --network sepolia

Set the request URL:
npx hardhat set-url --url <value> --network sepolia

Get the request URL:
npx hardhat read-url --network sepolia

Set the request path:
npx hardhat set-path --path <value> --network sepolia

Get the request path:
npx hardhat read-path --network sepolia

Set the LINK default fee amount:
npx hardhat set-fee --fee <value> --network sepolia

Set the LINK token address:
npx hardhat set-link --address <value> --network sepolia

Withdraw LINK:
npx hardhat withdraw --network sepolia

Prints an account's balance:
npx hardhat balance --network sepolia
```

## Output

The final `TableState` contract is deployed on Ethereum Sepolia: [here](https://sepolia.etherscan.io/address/0x22352F3c7765D389f2491108942de357f799Ec4F). You can read the `data` that was written to the contract from the offchain read.

It made a request to the Tableland testnets gateway for the data at `healthbot_11155111_1`:

- Request URL: https://testnets.tableland.network/api/v1/query?unwrap=true&statement=select%20%2A%20from%20healthbot_11155111_1
- Request path: `"counter"`
- Example response:

```json
{
  "counter": 4994
}
```
