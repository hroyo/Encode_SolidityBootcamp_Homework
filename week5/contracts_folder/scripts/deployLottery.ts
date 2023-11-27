import { ethers } from "hardhat";
import { Lottery, Lottery__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();


const BET_PRICE = 1;
const BET_FEE = 0.2;
const TOKEN_RATIO = 1000n;

let contract: Lottery;

async function main() {

    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
    console.log(`Using address ${wallet.address}`);

    const contractFactory = new Lottery__factory(wallet);
    contract = await contractFactory.deploy(
        "LotteryToken",
        "LT0",
        TOKEN_RATIO,
        ethers.parseUnits(BET_PRICE.toFixed(18)),
        ethers.parseUnits(BET_FEE.toFixed(18))
      );    

    await contract.waitForDeployment();
    const contractAddress = await contract.getAddress();
    console.log(`Lottery contract deployed at ${contractAddress}\n`);
    const tokenAddress = await contract.paymentToken();
    console.log(`Token contract deployed at ${tokenAddress}\n`);
}


main().catch((err) => {
    console.error(err);
    process.exitCode = 1;
});