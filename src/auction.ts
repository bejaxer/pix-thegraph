import { BigInt } from "@graphprotocol/graph-ts";
import { createAccount } from "./account";
import {
  SaleRequested,
  SaleUpdated,
  SaleCancelled,
  Purchased,
  Bid,
  BidCancelled,
} from "./entities/PIXAuctionSale/PIXAuctionSale";
import {
  Global,
  Sale,
  SaleLog,
  Bid as BidEntity,
  PIX,
} from "./entities/schema";

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

  let tokenIds = sale.tokenIds as Array<BigInt>;
  for (let i = 0; i < tokenIds.length; i++) {
    let pix = PIX.load(getPIXId(tokenIds[i]));
    if (pix != null) {
      pix.sale = sale.id;
      pix.save();

      if (i == 0) {
        sale.category = pix.category;
        sale.size = pix.size;
        sale.save();
      }
    }
  }

  let totalEntity = Global.load("totalSaleLogs");
  if (totalEntity == null) {
    totalEntity = new Global("totalSaleLogs");
    totalEntity.value = new BigInt(0);
  }

  let saleLog = new SaleLog(totalEntity.value.toString());
  saleLog.logId = totalEntity.value;
  saleLog.sale = getSaleId(event.params.saleId);
  saleLog.status = BigInt.fromI32(0);
  saleLog.save();

  totalEntity.value = totalEntity.value.plus(BigInt.fromI32(1));
  totalEntity.save();
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

  let entity = Global.load("auctionSales");
  entity.value = entity.value.minus(BigInt.fromI32(1));
  entity.save();

  let salesEntity = Global.load("pixOnSale");
  salesEntity.value = salesEntity.value.minus(
    BigInt.fromI32(sale.tokenIds.length)
  );
  salesEntity.save();

  let totalEntity = Global.load("totalSaleLogs");

  let saleLog = new SaleLog(totalEntity.value.toString());
  saleLog.logId = totalEntity.value;
  saleLog.sale = getSaleId(event.params.saleId);
  saleLog.status = BigInt.fromI32(1);
  saleLog.save();

  totalEntity.value = totalEntity.value.plus(BigInt.fromI32(1));
  totalEntity.save();
}

export function handleBid(event: Bid): void {
  createAccount(event.params.bidder);
  let totalBids = Global.load(getTotalBidsKey(event.params.saleId));
  if (totalBids == null) {
    totalBids = new Global(getTotalBidsKey(event.params.saleId));
    totalBids.value = BigInt.fromI32(0);
  }
  totalBids.value = totalBids.value.plus(BigInt.fromI32(1));
  totalBids.save();

  let sale = Sale.load(getSaleId(event.params.saleId));
  let bid = new BidEntity(getBidId(event.params.saleId, totalBids.value));
  bid.sale = getSaleId(event.params.saleId);
  bid.bidder = event.params.bidder.toHexString();
  bid.price = event.params.bidAmount;
  bid.isActive = true;
  if (sale != null) {
    bid.category = sale.category;
    bid.size = sale.size;
  }
  bid.save();
}

export function handleBidCancelled(event: BidCancelled): void {
  let totalBids = Global.load(getTotalBidsKey(event.params.saleId));

  let bid = BidEntity.load(getBidId(event.params.saleId, totalBids.value));
  if (
    bid.sale == getSaleId(event.params.saleId) &&
    bid.bidder == event.params.bidder.toHexString() &&
    bid.price == event.params.bidAmount &&
    bid.isActive
  ) {
    bid.isActive = false;
    bid.save();
  }
}

export function handleAuctionPurchased(event: Purchased): void {
  let sale = Sale.load(getSaleId(event.params.saleId));
  createAccount(event.params.buyer);
  sale.taker = event.params.buyer.toHexString();
  sale.isActive = false;
  sale.soldDate = event.block.timestamp;
  sale.save();

  let entity = Global.load("auctionSales");
  entity.value = entity.value.minus(BigInt.fromI32(1));
  entity.save();

  let salesEntity = Global.load("pixOnSale");
  salesEntity.value = salesEntity.value.minus(
    BigInt.fromI32(sale.tokenIds.length)
  );
  salesEntity.save();

  let totalEntity = Global.load("totalSaleLogs");

  let saleLog = new SaleLog(totalEntity.value.toString());
  saleLog.logId = totalEntity.value;
  saleLog.sale = getSaleId(event.params.saleId);
  saleLog.status = BigInt.fromI32(2);
  saleLog.save();

  totalEntity.value = totalEntity.value.plus(BigInt.fromI32(1));
  totalEntity.save();
}

function getSaleId(id: BigInt): string {
  return "A" + id.toString();
}

function getPIXId(id: BigInt): string {
  return "PIX - " + id.toString();
}

function getTotalBidsKey(saleId: BigInt): string {
  return "totalBidsOnSale - " + saleId.toString();
}

function getBidId(saleId: BigInt, bidCount: BigInt): string {
  return saleId.toString() + "-" + bidCount.toString();
}
