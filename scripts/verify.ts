import { network, run, contractConfig } from "hardhat";
require("@nomiclabs/hardhat-etherscan");

async function main() {
  console.log(`\nVerifying on '${network.name}'...`);
  // Verify rigs
  try {
    await run("verify:verify", {
      address: contractConfig.contractAddress,
      constructorArugments: [],
    });
  } catch (err: any) {
    // Check if the error is via hardhat or etherscan where already verified contracts throw a halting error
    // If it's an etherscan issue, "Reason: Already Verified" is embedded within a hardhat error message
    if (
      err.message === "Contract source code already verified" ||
      err.message.includes("Reason: Already Verified")
    ) {
      console.log(`Contract already verified'`);
    } else throw err;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
