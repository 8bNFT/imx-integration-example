import { Link, ImmutableXClient, ImmutableMethodResults } from '@imtbl/imx-sdk';
import { useEffect, useState } from 'react';
require('dotenv').config();

interface InventoryProps {
  client: ImmutableXClient,
  link: Link,
  wallet: string
}

const Inventory = ({client, link, wallet}: InventoryProps) => {
  const [inventory, setInventory] = useState<ImmutableMethodResults.ImmutableGetAssetsResult>(Object);

  // buying and selling
  const [sellAmount, setSellAmount] = useState('');
  const [sellTokenId, setSellTokenId] = useState('');
  const [sellTokenAddress, setSellTokenAddress] = useState('');
  const [sellCancelOrder, setSellCancelOrder] = useState('');

  useEffect(() => {
    load()
  }, [])

  async function load(): Promise<void> {
    setInventory(await client.getAssets({user: wallet, sell_orders: true}))
  };

  // sell an asset
  async function sellNFT() {
    await link.sell({
      amount: sellAmount,
      tokenId: sellTokenId,
      tokenAddress: sellTokenAddress
    })
    setInventory(await client.getAssets({user: wallet, sell_orders: true}))
  };

  // cancel sell order
  async function cancelSell() {
    await link.cancel({
      orderId: sellCancelOrder
    })
    setInventory(await client.getAssets({user: wallet, sell_orders: true}))
  };

  // helper function to generate random ids
  function random()
    : number {
    const min = 1;
    const max = 1000000000;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  return (
    <div>
      <div>
        Sell asset (create sell order):
        <br/>
        <label>
          Amount (ETH):
          <input type="text" value={sellAmount} onChange={e => setSellAmount(e.target.value)} />
        </label>
        <label>
          Token ID:
          <input type="text" value={sellTokenId} onChange={e => setSellTokenId(e.target.value)} />
        </label>
        <label>
          Token Address:
          <input type="text" value={sellTokenAddress} onChange={e => setSellTokenAddress(e.target.value)} />
        </label>
        <button onClick={sellNFT}>Sell</button>
      </div>
      <br/>
      <div>
        Cancel sell order:
        <br/>
        <label>
          Order ID:
          <input type="text" value={sellCancelOrder} onChange={e => setSellCancelOrder(e.target.value)} />
        </label>
        <button onClick={cancelSell}>Cancel</button>
      </div>
      <br/><br/><br/>
      <div>
        <h3 className="margin--none">Inventory:</h3>
        {/* {JSON.stringify(inventory.result)} */}
        {
          inventory.result && inventory.result.map(asset=>{
            return <pre key={asset.token_address + asset.token_id} className="block--inline" 
            onClick={
              ()=>{
                setSellTokenId(asset.token_id)
                setSellTokenAddress(asset.token_address)
              }
            }>
              {JSON.stringify(asset, null, 4)}
            </pre>
          })
        }
      </div>
    </div>
  );
}

export default Inventory;
