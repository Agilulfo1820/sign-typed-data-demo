import { BaseWallet, CertificateBasedWallet } from "@vechain/dapp-kit";
import { ethers } from "ethers";

export class ExtendedCertificateBasedWallet extends CertificateBasedWallet {
  protected extendedWallet: BaseWallet;
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
    this.extendedWallet = wallet;
  }

  signTypedData = async (
    _domain: ethers.TypedDataDomain,
    _types: Record<string, ethers.TypedDataField[]>,
    _value: Record<string, unknown>
  ): Promise<string> => {
    return this.extendedWallet.signTypedData(_domain, _types, _value);
  };
}
