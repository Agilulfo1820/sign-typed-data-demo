declare namespace Connex {
  interface Signer {
    signTypedData: (
      _domain: ethers.TypedDataDomain,
      _types: Record<string, ethers.TypedDataField[]>,
      _value: Record<string, unknown>
    ) => Promise<string>;
  }
}
