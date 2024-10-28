import {
  web3Accounts,
  web3Enable,
  // web3FromAddress,
  web3FromSource,
} from "@polkadot/extension-dapp";
// import { Web3AccountsOptions } from "@polkadot/extension-inject/types";

export const getSigner = async () => {
  try {
    const extensions = await web3Enable("Softlaw");

    if (extensions.length === 0) {
      alert(
        "No Extension Found. Please install or connect from your Talisman Wallet."
      );
      return;
    }

    console.log(extensions);
    const allAccounts = await web3Accounts();
    console.log(allAccounts);

    if (allAccounts.length > 0) {
      let account = allAccounts[1];
      const injector = await web3FromSource(account.meta.source);
      let signer = injector?.signer;
      console.log(signer);
      return signer;
    }
  } catch (e) {
    console.log(e);
  }
};
