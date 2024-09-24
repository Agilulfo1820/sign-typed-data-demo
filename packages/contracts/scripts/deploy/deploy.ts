import { ethers, network } from "hardhat";
import { ContractsConfig } from "@repo/config/contracts/type";
import { HttpNetworkConfig } from "hardhat/types";
import { saveContractsToFile } from "../helpers";
import { Network } from "@repo/constants";
import { AppConfig, getConfig } from "@repo/config";
import fs from "fs";
import path from "path";

const appConfig = getConfig();

export async function deployAll(config: ContractsConfig) {
  const start = performance.now();
  const networkConfig = network.config as HttpNetworkConfig;
  console.log(
    `================  Deploying contracts on ${network.name} (${networkConfig.url}) with ${config.VITE_APP_ENV} configurations `
  );
  const [deployer] = await ethers.getSigners();

  console.log(`================  Address used to deploy: ${deployer.address}`);

  // ---------------------- Deploy Contracts ----------------------

  // Deploy the fiorino contract
  const contractName = "Fiorino";
  const owner = "0xf077b491b355e64048ce21e3a6fc4751eeea77fa";
  const FiorinoContract = await ethers.getContractFactory(contractName);
  const fiorino = await FiorinoContract.deploy(owner);
  await fiorino.waitForDeployment();
  console.log(`${contractName} impl.: ${await fiorino.getAddress()}`);

  const date = new Date(performance.now() - start);
  console.log(
    `================  Contracts deployed in ${date.getMinutes()}m ${date.getSeconds()}s `
  );

  const contractAddresses: Record<string, string> = {
    fiorino: await fiorino.getAddress(),
  };

  console.log("Contracts", contractAddresses);
  await saveContractsToFile(contractAddresses);

  const end = new Date(performance.now() - start);
  console.log(
    `Total execution time: ${end.getMinutes()}m ${end.getSeconds()}s`
  );

  console.log("Deployment completed successfully!");
  console.log(
    "================================================================================"
  );

  await overrideContractConfigWithNewContracts(
    {
      fiorino,
    },
    appConfig.network
  );

  return {
    fiorino,
  };
  // close the script
}

export async function overrideContractConfigWithNewContracts(
  contracts: Awaited<ReturnType<typeof deployAll>>,
  network: Network
) {
  const newConfig: AppConfig = {
    ...appConfig,
    fiorinoContractAddress: await contracts.fiorino.getAddress(),
  };

  // eslint-disable-next-line
  const toWrite = `import { AppConfig } from \".\" \n const config: AppConfig = ${JSON.stringify(newConfig, null, 2)};
  export default config;`;

  const configFiles: { [key: string]: string } = {
    solo: "local.ts",
    testnet: "testnet.ts",
    main: "mainnet.ts",
  };
  const fileToWrite = configFiles[network.name];
  const localConfigPath = path.resolve(`../config/${fileToWrite}`);
  console.log(`Writing new config file to ${localConfigPath}`);
  fs.writeFileSync(localConfigPath, toWrite);
}
