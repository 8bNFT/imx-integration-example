import { Link, ImmutableXClient, ImmutableMethodResults, ImmutableOrderStatus} from '@imtbl/imx-sdk';
import { useEffect, useState } from 'react';
require('dotenv').config();

interface MarketplaceProps {
  client: ImmutableXClient,
  link: Link
}

const Marketplace = ({client, link}: MarketplaceProps) => {
  const [marketplace, setMarketplace] = useState<ImmutableMethodResults.ImmutableGetOrdersResult>(Object);
  const [buyOrderId, setBuyOrderId] = useState('');

  useEffect(() => {
    load()
  }, [])

  async function load(): Promise<void> {
    setMarketplace(await client.getOrders({status: ImmutableOrderStatus.active}))
  };

  // buy an asset
  async function buyNFT() {
    await link.buy({
      orderIds:[buyOrderId]
    })
  };

  return (
    <div>
      <div>
        <h3 className="margin--none">Buy asset:</h3>
        <br/>
        <label>
          Order ID:
          <input type="text" value={buyOrderId} onChange={e => setBuyOrderId(e.target.value)} />
        </label>
        <button onClick={buyNFT}>Buy</button>
      </div>
      <br/><br/><br/>
      <div>
      <h3 className="margin--none">Marketplace (active sell orders):</h3>
        <br/>
        {/* {JSON.stringify(marketplace.result)} */}
        {
          marketplace.result && marketplace.result.map(asset=>{
            return <pre key={asset.order_id} className="block--inline" onClick={()=>setBuyOrderId(asset.order_id.toString())}>
              {JSON.stringify(asset, null, 4)}
            </pre>
          })
        }
      </div>
    </div>
  );
}

export default Marketplace;
