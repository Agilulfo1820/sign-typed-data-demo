import { BaseWallet, CertificateBasedWallet } from "@vechain/dapp-kit";
import { ethers } from "ethers";

export class ExtendedCertificateBasedWallet extends CertificateBasedWallet {
  constructor(
    wallet: BaseWallet,
    connectionCertificateData?:
      | {
          message?: Connex.Vendor.CertMessage | undefined;
          options?: Connex.Signer.CertOptions | undefined;
        }
      | undefined
  ) {
    super(wallet, connectionCertificateData);
  }

  signTypedData = async (
    _domain: ethers.TypedDataDomain,
    _types: Record<string, ethers.TypedDataField[]>,
    _value: Record<string, unknown>
  ): Promise<string> => {
    // Your custom implementation for signTypedData
    console.log("Signing typed data");
    this.signTypedData(_domain, _types, _value);
    return "signed data"; // Replace with actual signing logic
  };
}
