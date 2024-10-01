import { ethers, network } from "hardhat";
import { expect } from "chai";
import { getOrDeployContractInstances } from "./helpers";
import { describe, it } from "mocha";

describe("Ether Mail ", function () {
  it("Can sign and verify", async function () {
    const { etherMail712, deployer } = await getOrDeployContractInstances({
      forceDeploy: true,
    });
    console.log(deployer.address);
    console.log(network.config.chainId);

    // All properties on a domain are optional
    const domain = {
      name: "Ether Mail",
      version: "1",
      chainId: network.config.chainId,
      verifyingContract: await etherMail712.getAddress(),
    };

    // The named list of all type definitions
    const types = {
      Person: [
        { name: "name", type: "string" },
        { name: "wallet", type: "address" },
      ],
      Mail: [
        { name: "from", type: "Person" },
        { name: "to", type: "Person" },
        { name: "contents", type: "string" },
      ],
    };

    // The data to sign
    const value = {
      from: {
        name: "Cow",
        wallet: "0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826",
      },
      to: {
        name: "Bob",
        wallet: "0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB",
      },
      contents: "Hello, Bob!",
    };

    // Sign the data
    const signature = await deployer.signTypedData(domain, types, value);

    // Verify the signature
    const verifyResult = await etherMail712.verify(
      value.from,
      value.to,
      value.contents,
      signature,
      deployer.address
    );

    expect(verifyResult).to.be.true;
  });
});
