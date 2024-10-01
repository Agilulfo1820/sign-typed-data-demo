import { useQuery } from "@tanstack/react-query";
import {
  EtherMail712,
  EtherMail712__factory,
} from "@repo/contracts/typechain-types";
import { useConnex } from "@vechain/dapp-kit-react";
import { getConfig } from "@repo/config";

const EtherMailInterface = EtherMail712__factory.createInterface();

export const getVerifySignature = async (
  thor: Connex.Thor,
  data: {
    from: EtherMail712.PersonStruct;
    to: EtherMail712.PersonStruct;
    contents: string;
  },
  signature: string,
  signer: string
): Promise<string> => {
  const functionFragment =
    EtherMailInterface.getFunction("verify").format("json");
  const contractAddress = getConfig(import.meta.env.VITE_APP_ENV).etherMail712;

  const res = await thor
    .account(contractAddress)
    .method(JSON.parse(functionFragment))
    .call(data.from, data.to, data.contents, signature, signer);

  if (res.reverted) throw new Error("Reverted");

  return res.decoded[0];
};

export const getVerifySignatureQueryKey = (
  data: {
    from: EtherMail712.PersonStruct;
    to: EtherMail712.PersonStruct;
    contents: string;
  },
  signature: string,
  signer: string
) => ["verifySignature", data, signature, signer];

export const useVerifySignature = (
  data: {
    from: EtherMail712.PersonStruct;
    to: EtherMail712.PersonStruct;
    contents: string;
  },
  signature: string,
  signer: string
) => {
  const { thor } = useConnex();

  return useQuery({
    queryKey: getVerifySignatureQueryKey(data, signature, signer),
    queryFn: async () => getVerifySignature(thor, data, signature, signer),
    enabled: !!thor && !!data && !!signature && !!signer,
  });
};
