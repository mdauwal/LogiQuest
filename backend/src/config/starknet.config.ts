import { RpcProvider, Signer, Account } from 'starknet';

export const provider = new RpcProvider({
  nodeUrl: 'https://starknet-mainnet.g.alchemy.com/starknet/version/rpc/v0_7/lekrIk80ISiYrYzJuGHeuB4eHyRX_i76'
});

//🔑 How to Get an Alchemy Key:
// Go to Alchemy – https://www.alchemy.com
// Sign up or log in
// Create a new app
// Select Starknet as the network
// Choose Mainnet or Testnet
// Copy the RPC URL


const privateKey ='0x0027214459e7B037f253CAB8FD62bFA3725Df0b008754320b6F2c8684151A161';
const signer = new Signer(privateKey);

let starkAccount: Account;

(async () => {
  const publicKey = await signer.getPubKey(); // Get public key from signer
  console.log('Public Key:', publicKey);

  // Create account using provider, address (public key), and signer
   const starkAccount = new Account(provider, publicKey, signer);
  console.log('Account:', starkAccount);
})();


export { starkAccount };



