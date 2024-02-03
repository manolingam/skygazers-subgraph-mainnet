import { Transfer } from '../generated/Contract/Contract';
import { SkyGazer, SkyGazerOwner } from '../generated/schema';

const zeroAddress = '0x0000000000000000000000000000000000000000';

export function handleMint(event: Transfer): void {
  let skygazer = new SkyGazer(event.params.tokenId.toHex());
  let skygazerMinter = SkyGazerOwner.load(event.params.to.toHex());

  if (skygazerMinter == null) {
    skygazerMinter = new SkyGazerOwner(event.params.to.toHex());
  }

  skygazerMinter.address = event.params.to;

  skygazer.tokenId = event.params.tokenId;
  skygazer.owner = skygazerMinter.id;
  skygazer.tokenUri = `ipfs://QmP56v7jD7ozSPJi9L8xreW45YS2ZJe4uNgfJP14vout2U/${event.params.tokenId}.json`;

  skygazerMinter.save();
  skygazer.save();
}

export function handleSale(event: Transfer): void {
  let skygazer = SkyGazer.load(event.params.tokenId.toHexString());
  let presentSkyGazerOwner = SkyGazerOwner.load(event.params.to.toHexString());

  if (presentSkyGazerOwner == null) {
    presentSkyGazerOwner = new SkyGazerOwner(event.params.to.toHexString());
    presentSkyGazerOwner.address = event.params.to;
  }

  if (skygazer == null) {
    skygazer = new SkyGazer(event.params.tokenId.toHexString());
  }

  skygazer.owner = presentSkyGazerOwner.id;

  presentSkyGazerOwner.save();
  skygazer.save();
}

export function handleTransfer(event: Transfer): void {
  let from = event.params.from.toHexString();
  let to = event.params.to.toHexString();

  if (from == zeroAddress && to != zeroAddress) {
    handleMint(event);
  } else if (from != zeroAddress && to != zeroAddress) {
    handleSale(event);
  }
}
