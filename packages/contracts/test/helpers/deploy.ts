import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ContractTransactionResponse } from "ethers";
import { ethers } from "hardhat";
import { EtherMail712 } from "../../typechain-types";

interface DeployInstance {
  etherMail712: EtherMail712 & {
    deploymentTransaction(): ContractTransactionResponse;
  };

  deployer: HardhatEthersSigner;
  admin: HardhatEthersSigner;
  proxyAdmin: HardhatEthersSigner;
  otherAccounts: HardhatEthersSigner[];
}

let cachedDeployInstance: DeployInstance | undefined = undefined;
export const getOrDeployContractInstances = async ({ forceDeploy = false }) => {
  if (!forceDeploy && cachedDeployInstance !== undefined) {
    return cachedDeployInstance;
  }

  // Contracts are deployed using the first signer/account by default
  const [deployer, admin, ...otherAccounts] = await ethers.getSigners();
  const proxyAdmin = otherAccounts[90];

  const contractName = "EtherMail712";
  const EtherMail712 = await ethers.getContractFactory(contractName);
  const contract = await EtherMail712.deploy();
  await contract.waitForDeployment();

  cachedDeployInstance = {
    etherMail712: contract,
    deployer,
    admin,
    proxyAdmin,
    otherAccounts,
  };
  return cachedDeployInstance;
};
