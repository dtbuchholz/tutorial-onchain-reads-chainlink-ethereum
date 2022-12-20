# TableState

On-chain table state using Chainlink's [Any API](https://docs.chain.link/getting-started/advanced-tutorial/) and [Arbitrum](https://developer.offchainlabs.com/getting-started-devs).

# Background

## Overview

This project demonstrates how to query off-chain Tableland table state and get data back on-chain. It leverages Chainlink's Oracle network to fulfill on-chain requests at the Tableland gateway and write the data back to the smart contract, allowing for on-chain reads to take place. Arbitrum's Goerli testnet is also used to demonstrate how to use Chainlink in a testnet environment.

This example hard codes the Chainlink Oracle and contract info for the Arbtrum Goerli network. Note this is a ["single word"](https://docs.chain.link/any-api/get-request/examples/single-word-response/) response of a `uint256`, but others are possible (see [Any API docs](https://docs.chain.link/any-api/introduction)). The Oracle used here is [Translucent](https://translucent.link/products/get-uint256/). This is unique since the the Chainlink documentation [does not list Arbitrum Goerli](https://docs.chain.link/any-api/testnet-oracles/) as a network with Chainlink-moderated contracts, so using this setup allows developers to access potentially new testnet deployment grounds on the Arbitrum Goerli network.

For a full walkthrough, see the documentation [here](https://docs.tableland.xyz/on-chain-reads-with-chainlink-arbitrum).

## Project Structure

The final output of this project produces the following:

- `tasks` => Holds a number of useful tasks, including requesting and reading off-chain table data.
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

# Usage

## Setup

Before getting started, be sure to update the values in a `.env` file as well as sign up for an [Alchemy](https://alchemy.com/) and [Arbiscan](https://arbiscan.io/myapikey) account:

```
# Account private key
ABRITRUM_GOERLI_PRIVATE_KEY=fixme
# Alchemy API key
ABRITRUM_GOERLI_API_KEY=fixme
# Arbiscan API key (contract verification)
ABRISCAN_API_KEY=fixme
```

## Deployment

Deploy the contract, where the `url` and `path` are set within the `deploy` script and also avaible as tasks, if needed:

```
npx hardhat run scripts/deploy.ts --network arbitrum-goerli
```

Upon deploying, save the value of the contract is `hardhat.configs.ts`, under the `config` variable's `config` key. Below is an example of what this should look like. The reference to Translucent is the node operator; Chainlink also has a series of hosted nodes that can be used for testing purposes (expect, they don't have an Aribtrum Goerli option). Keep in mind that each node may implement data transformation parameters slightly differently (e.g., `req.addInt("multiply", ...)` vs. `req.addInt("times", ...)`).

```javascript
...
config: {
  args: {
    contractAddress: "0x383f1BAA132Cea7CFfb2780f2935deD0f8e7E654#code", // IMPORTANT: Update with deployed contract
    linkTokenAddress: "0xd14838A68E8AFBAdE5efb411d5871ea0011AFd28", // Arbitrum Goerli LINK token
    oracleAddress: "0x2362A262148518Ce69600Cc5a6032aC8391233f5", // Translucent (node operator) address
    jobId: "7599d3c8f31e4ce78ad2b790cbcfc673" // Translucent job ID for single word uint256 request
  }
}
...
```

Optionally, verify the contract:

```
npx hardhat run scripts/verify.ts --network arbitrum-goerli
```

## Tasks

A number of tasks are included. Some simply read on-chain data, and others cause state to be overwritten. All tasks can be listed with the command `npx hardhat`.

Make a request to the Tableland gateway for the Chainlink Oracle to fulfill:

```
npx hardhat request-data --network arbitrum-goerli
```

Read the associated response that's written back on-chain:

```
npx hardhat read-data --network arbitrum-goerli
```

Try running some of the other tasks:

```
Fund the contract with 1 LINK:
npx hardhat fund-link --network arbitrum-goerli

Set the request URL:
npx hardhat set-url --url <value> --network arbitrum-goerli

Get the request URL:
npx hardhat read-url --network arbitrum-goerli

Set the request path:
npx hardhat set-path --path <value> --network arbitrum-goerli

Get the request path:
npx hardhat read-path --network arbitrum-goerli

Set the LINK default fee amount:
npx hardhat set-fee --fee <value> --network arbitrum-goerli

Set the LINK token address:
npx hardhat set-link --address <value> --network arbitrum-goerli

Withdraw LINK:
npx hardhat withdraw --network arbitrum-goerli
```

# Output

The following `TableState` contract was deployed on Arbitrum Goerli:

- Contract: [0x383f1BAA132Cea7CFfb2780f2935deD0f8e7E654](https://goerli.arbiscan.io/address/0x383f1BAA132Cea7CFfb2780f2935deD0f8e7E654)

It makes a request to the Tableland testnets gateway for the data at `healthbot_421613_1`:

- Request URL: https://testnets.tableland.network/query?unwrap=true&s=select%20%2A%20from%20healthbot_421613_1
- Request path: `"counter"`
- Example response:

```json
{
  "counter": 68974
}
```
