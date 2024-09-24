import {
  Button,
  Card,
  CardBody,
  CardFooter,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Code } from "@chakra-ui/react";
import { useState } from "react";
import {
  ThorClient,
  VeChainProvider,
  ProviderInternalBaseWallet,
} from "@vechain/sdk-network";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { VeChainSignerDAppKit } from "../../../../utils";
import { useWallet } from "@vechain/dapp-kit-react";
import { CertificateBasedWallet } from "@vechain/dapp-kit";
import { getConfig } from "@repo/config";
// import { ERC20_ABI, VTHO_ADDRESS } from "@vechain/sdk-core";

export const SignTypedDataCard = () => {
  const [signature, setSignature] = useState<string | null>(null);

  // All properties on a domain are optional
  const domain = {
    name: "Ether Mail",
    version: "1",
    chainId: 1,
    verifyingContract: "0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC",
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

  const { account } = useWallet();

  const sign = async () => {
    if (!window.vechain) {
      return;
    }
    const wallet = new CertificateBasedWallet(
      window.vechain?.newConnexSigner(getConfig("testnet").network.genesis.id)
    );

    const signer = new VeChainSignerDAppKit(
      wallet,
      account ?? "",
      new VeChainProvider(
        ThorClient.fromUrl(getConfig("testnet").network.urls[0])
      )
    );

    // Test that I can transfer VTHO opening the wallet
    // const vthoCotnract = ThorClient.fromUrl(
    //   getConfig("testnet").network.urls[0]
    // ).contracts.load(VTHO_ADDRESS, ERC20_ABI, signer);
    // await vthoCotnract.transact.transfer(
    //   "0x3f90bF8b314C42005103B3c94505634fA680Dcee",
    //   BigInt(1)
    // );

    // THIS NEEDS TO BE IMPLEMENTED IN THE EXTENSION
    signer.signTypedData(domain, types, value).then((signature) => {
      setSignature(signature);
    });
  };

  const signWithFakeWallet = async () => {
    const privateKey = generatePrivateKey();
    const account = privateKeyToAccount(privateKey);

    const thor = ThorClient.fromUrl(getConfig("testnet").network.urls[0]);

    const rootAccount = {
      privateKey: Buffer.from(privateKey.slice(2), "hex"),
      address: account.address,
    };
    const provider = new VeChainProvider(
      thor,
      new ProviderInternalBaseWallet([rootAccount])
    );
    const rootSigner = await provider.getSigner(rootAccount.address);

    if (!rootSigner) {
      throw new Error("Root signer is null");
    }

    rootSigner.signTypedData(domain, types, value).then((signature) => {
      setSignature(signature);
    });
  };

  return (
    <Card>
      <CardBody>
        <VStack align="start">
          <Text fontSize="lg" fontWeight="bold">
            Sign Typed Data
          </Text>

          <Text fontSize="sm" color="gray.500">
            Domain
          </Text>
          <Code children={JSON.stringify(domain)} />

          <Text fontSize="sm" color="gray.500">
            Types
          </Text>
          <Code children={JSON.stringify(types)} />

          <Text fontSize="sm" color="gray.500">
            Value
          </Text>
          <Code children={JSON.stringify(value)} />
        </VStack>
      </CardBody>

      <CardFooter>
        <VStack align="start" spacing={2}>
          <HStack>
            <Button colorScheme="blue" size="sm" onClick={sign}>
              Sign with connected wallet
            </Button>

            <Button colorScheme="gray" size="sm" onClick={signWithFakeWallet}>
              Sign with fake wallet
            </Button>
          </HStack>

          {signature && (
            <HStack justify="flex-end" spacing={4}>
              <Text color="gray.500">Signature:</Text>
              <Code>{signature}</Code>
            </HStack>
          )}
        </VStack>
      </CardFooter>
    </Card>
  );
};
