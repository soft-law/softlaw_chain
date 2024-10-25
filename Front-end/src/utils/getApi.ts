import { ApiPromise, WsProvider } from "@polkadot/api";

export const getApi = async () => {
  const wsProvider = new WsProvider("ws://127.0.0.1:55465");
  const api = await ApiPromise.create({ provider: wsProvider });
  console.log(api.genesisHash.toHex());
  return api;
};
