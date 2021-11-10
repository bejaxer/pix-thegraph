import { BigInt } from "@graphprotocol/graph-ts";
import {
  SaleRequested,
  SaleUpdated,
  SaleCancelled,
} from "./entities/PIXAuctionSale/PIXAuctionSale";
import { Global, Sale } from "./entities/schema";

export function handleAuctionRequested(event: SaleRequested): void {
  let entity = Global.load("auctionSales");
  if (entity == null) {
    entity = new Global("auctionSales");
    entity.value = new BigInt(0);
  }
  entity.value = entity.value.plus(BigInt.fromI32(1));
  entity.save();
  let salesEntity = Global.load("pixOnSale");
  if (salesEntity == null) {
    salesEntity = new Global("pixOnSale");
    salesEntity.value = new BigInt(0);
  }
  salesEntity.value = salesEntity.value.plus(
    BigInt.fromI32(event.params.tokenIds.length)
  );
  salesEntity.save();

  let sale = new Sale(getSaleId(event.params.saleId));
  sale.type = BigInt.fromI32(2);
  sale.isActive = true;
  sale.requestor = event.params.seller.toHexString();
  sale.tokenIds = event.params.tokenIds;
  sale.price = event.params.price;
  sale.endTime = event.params.endTime;
  sale.save();
}

export function handleAuctionUpdated(event: SaleUpdated): void {
  let sale = Sale.load(getSaleId(event.params.saleId));
  sale.price = event.params.newPrice;
  sale.endTime = event.params.newEndTime;
  sale.save();
}

export function handleAuctionCancelled(event: SaleCancelled): void {
  let sale = Sale.load(getSaleId(event.params.saleId));
  sale.isActive = false;
  sale.save();
}

function getSaleId(id: BigInt): string {
  return id.toString();
}
