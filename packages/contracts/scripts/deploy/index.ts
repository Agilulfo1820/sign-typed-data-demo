// We recommend this pattern to be able to use async/await everywhere

import { getContractsConfig } from "@repo/config";
import { deployAll } from "./deploy";
import { EnvConfig } from "@repo/config/contracts";

// and properly handle errors.
const execute = async () => {
  if (!process.env.VITE_APP_ENV) {
    throw new Error("Missing VITE_APP_ENV");
  }

  await deployAll(getContractsConfig(process.env.VITE_APP_ENV as EnvConfig));
};

execute()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
