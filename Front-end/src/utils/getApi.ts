import { ApiPromise, WsProvider } from "@polkadot/api";

export const getApi = async () => {
  // const wsProvider = new WsProvider("ws://127.0.0.1:55465");
  const wsProvider = new WsProvider("wss://fraa-dancebox-3129-rpc.a.dancebox.tanssi.network");
  const api = await ApiPromise.create({ provider: wsProvider });
  console.log(api.genesisHash.toHex());
  return api;
};
