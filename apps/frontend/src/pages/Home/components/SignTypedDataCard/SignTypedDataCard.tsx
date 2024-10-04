import {
  Button,
  Card,
  CardBody,
  CardFooter,
  HStack,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import {
  ThorClient,
  VeChainProvider,
  ProviderInternalBaseWallet,
} from "@vechain/sdk-network";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { VeChainSignerDAppKit } from "../../../../utils";
import { useWallet } from "@vechain/dapp-kit-react";
import { getConfig } from "@repo/config";
import { ExtendedCertificateBasedWallet } from "./ExtendedSignTypedData";
import { useVerifySignature } from "../../../../hooks/useVerifySignature";
// import { ERC20_ABI, VTHO_ADDRESS } from "@vechain/sdk-core";

export const SignTypedDataCard = () => {
  const thor = ThorClient.fromUrl(
    getConfig(import.meta.env.VITE_APP_ENV).nodeUrl
  );

  const [signature, setSignature] = useState<string | null>(null);
  const [signer, setSigner] = useState<string | null>(null);
  const [chainId, setChainId] = useState<string | null>(null);

  const contractAddress = getConfig(import.meta.env.VITE_APP_ENV).etherMail712;

  /**
   * identify the current chain from its genesis block
   */
  useEffect(() => {
    thor.blocks
      .getGenesisBlock()
      .then(
        (genesis) => genesis?.id && setChainId(BigInt(genesis.id).toString())
      )
      .catch(() => {
        /* ignore */
      });
  }, [thor]);

  // All properties on a domain are optional
  const domain = {
    name: "Ether Mail",
    version: "1",
    chainId: chainId,
    verifyingContract: contractAddress,
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

  const { data: verifyResult } = useVerifySignature(
    value,
    signature ?? "",
    signer ?? ""
  );

  const sign = async () => {
    if (!window.vechain) {
      return;
    }
    const wallet = new ExtendedCertificateBasedWallet( // -> dappkit
      window.vechain?.newConnexSigner(getConfig("testnet").network.genesis.id) // -> veworld + estension
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
    signer
      .signTypedData(domain, types, value, {
        signer: account ?? "",
      })
      .then((signature) => {
        setSignature(signature);
        setSigner(account);
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
      setSigner(account.address);
    });
  };

  return (
    <>
      <Card>
        <CardBody>
          <VStack align="start">
            <Text fontSize="lg" fontWeight="bold">
              Sign Typed Data
            </Text>

            <Text fontSize="sm" color="gray.500">
              Domain
            </Text>

            <Textarea
              value={JSON.stringify(domain)}
              disabled
              overflowY={"hidden"}
              resize="none"
            />

            <Text fontSize="sm" color="gray.500">
              Types
            </Text>
            <Textarea
              value={JSON.stringify(types)}
              disabled
              overflowY={"hidden"}
              resize="none"
            />

            <Text fontSize="sm" color="gray.500">
              Value
            </Text>
            <Textarea
              value={JSON.stringify(value)}
              disabled
              overflowY={"hidden"}
              resize="none"
            />
          </VStack>
        </CardBody>

        <CardFooter>
          <VStack align="start" spacing={2}>
            <HStack>
              <Button colorScheme="blue" size="sm" onClick={sign}>
                Sign with connected wallet
              </Button>

              <Button colorScheme="gray" size="sm" onClick={signWithFakeWallet}>
                Sign with random wallet
              </Button>
            </HStack>
          </VStack>
        </CardFooter>
      </Card>

      {/* Card for result */}
      <Card>
        <CardBody>
          <VStack align="start">
            <Text fontSize="lg" fontWeight="bold">
              Result
            </Text>

            <Text fontSize="sm" color="gray.500">
              Signature
            </Text>
            <Input value={signature ?? ""} disabled />

            <Text fontSize="sm" color="gray.500">
              Signer
            </Text>
            <Input value={signer ?? ""} disabled />
          </VStack>
        </CardBody>
        <CardFooter>
          {signature && (
            <VStack align="start">
              <Text fontSize="lg" fontWeight="bold">
                Verification
              </Text>

              <Text fontSize="sm" color="gray.500">
                Signature is valid: {verifyResult ? "Yes" : "No"}
              </Text>
              {verifyResult}
            </VStack>
          )}
        </CardFooter>
      </Card>
    </>
  );
};
