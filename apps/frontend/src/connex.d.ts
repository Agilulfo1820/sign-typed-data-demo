interface SignTypedDataOptions {
  signer?: string;
}

declare namespace Connex {
  interface Signer {
    signTypedData: (
      _domain: ethers.TypedDataDomain,
      _types: Record<string, ethers.TypedDataField[]>,
      _value: Record<string, unknown>,
      _options?: SignTypedDataOptions
    ) => Promise<string>;
  }
}


type RequestMethod =
    | RequestType.Connect
    | RequestType.SendTransaction
    | RequestType.SignCertificate

type RequestArguments = {
    method: RequestMethod
    params?: unknown[] | object
}

type RequestFunction = (args: RequestArguments) => Promise<unknown>



type EventHandler = (
  event: EventTypes,
  callback: (data: unknown) => void,
) => void

declare global {
    interface Window {
        vechain?: {
            newConnexSigner: (genesisId: string) => Connex.Signer;
            isInAppBrowser?: boolean;
            request: RequestFunction
            on: EventHandler
            removeListener: EventHandler
        };
        connex?: unknown;
    }
}