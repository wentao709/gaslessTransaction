import { ethers } from 'ethers';
import { createInstance } from './forwarder';
import { signMetaTxRequest } from './signer';
import { Web3 } from 'web3';

async function sendTx(registry, name) {
  console.log(`Sending register tx to set name=${name}`);
  return registry.register(name);
}

async function sendMetaTx(registry, provider, signer, name) {
  console.log(`Sending register meta-tx to set name=${name}`);
  const url = process.env.REACT_APP_WEBHOOK_URL;
  if (!url) throw new Error(`Missing relayer url`);

  const forwarder = createInstance(provider);
  const from = await signer.getAddress();
  const data = registry.interface.encodeFunctionData('register', [name]);
  console.log(data)

  const to = registry.address;
  const request = await signMetaTxRequest(signer, forwarder, { to, from, data });
  console.log(request);
  console.log("transaction start");
 return fetch(url, {
    method: 'POST',
    body: JSON.stringify(request),
    headers: { 'Content-Type': 'application/json' },
  });
}

export async function registerName(registry, provider, name) {
//  if (!name) throw new Error(`Name cannot be empty`);
//  if (!window.ethereum) throw new Error(`User wallet not found`);

//  await window.ethereum.enable();
  //const userProvider = new ethers.providers.Web3Provider(window.ethereum); 
  const wallet = ethers.Wallet.createRandom(); // assume it's a user's wallet for now
//  const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
//  console.log(wallet);
//  console.log(wallet.provider)
 // const userProvider = new ethers.providers.JsonRpcProvider("ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
  const apiKey = "K-X0OvQcMVBsQmCkFvb8jG109n7_vM5p"
  const userProvider = new ethers.providers.AlchemyProvider('goerli', apiKey);
  console.log(123);
//  const userNetwork = await userProvider.getNetwork();
//  if (userNetwork.chainId !== 5) throw new Error(`Please switch to Goerli for signing`);
  const privateKey = "786300751a36858235054e82d6b0fd84202b6b79026c62e9d258166cb100b97a";
const signer = new ethers.Wallet(privateKey, userProvider);
  console.log("324");
  const from = await signer.getAddress();
  const balance = await provider.getBalance(from);
  
  const canSendTx = balance.gt(1e15);
//  if (canSendTx) return sendTx(registry.connect(signer), name);
  const result = sendMetaTx(registry, provider, signer, name);
  console.log(result);
  return result;
}
