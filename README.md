# TableState

This project demonstrates how to query off-chain Tableland table state and get data back on-chain. It leverages Chainlink's Oracle network to fulfill on-chain requests at the Tableland gateway and write the data back to the smart contract.

## Usage

This example hard codes the Chainlink Oracle and contract info for the Ethereum Goerli network. Note this is a ["single word"](https://docs.chain.link/any-api/get-request/examples/single-word-response/) response of a `uint256`, but others are possible (see [Any API docs](https://docs.chain.link/any-api/introduction)). The Oracle used here is ([Translucent](https://translucent.link/products/get-uint256/)).

Before getting started, be sure to update the values in a `.env` file:

```
# Account private key
ETHEREUM_GOERLI_PRIVATE_KEY=fixme
# Alchemy API key
ETHEREUM_GOERLI_API_KEY=fixme
# Etherescan API key (contract verification)
ETHERSCAN_API_KEY=fixme
```

Deploy the contract, with the `url` and `path` configurable in the deploy script and avaible as setter methods, if needed:
`npx hardhat run scripts/deploy.ts --network ethereum-goerli`

Upon deploying, save the value of the contract is `hardhat.configs.ts`, under the `config` variable's `config` key:

```javascript
...
config: {
    args: { contractAddress: "0xbb7051B5fC1B713dacf4AdFa20b22F6B43B184d2" },
},
...
```

Make a request to the Tableland gateway for the Chainlink Oracle to fulfill:
`npx hardhat request-data --network ethereum-goerli`

Read the associated response that's written back on-chain:
`npx hardhat read-data --network ethereum-goerli`

Try running some of the other tasks:

```shell
Fund the contract with 1 LINK:
npx hardhat fund-link --network ethereum-goerli

Set the request URL:
npx hardhat set-url --url <value> --network ethereum-goerli

Get the request URL: --network ethereum-goerli
npx hardhat read-url --network ethereum-goerli

Set the request path:
npx hardhat set-path --path <value> --network ethereum-goerli

Get the request path:
npx hardhat read-path --network ethereum-goerli

Withdraw LINK:
npx hardhat withdraw --network ethereum-goerli
```

## Example

The following contract was deployed on Ethereum Goerli:

- Contract: [0xbb7051B5fC1B713dacf4AdFa20b22F6B43B184d2](https://goerli.etherscan.io/address/0xa1e54be486198b6cf71527eedd0df82e049e2c40)
- Request URL: https://testnets.tableland.network/query?unwrap=true&s=select%20*%20from%20healthbot_5_1
- Request path: `"counter"`
