import { BigInt } from "@graphprotocol/graph-ts";
import { createAccount } from "./account";
import {
  SaleRequested,
  SaleUpdated,
  SaleCancelled,
  Purchased,
} from "./entities/PIXFixedSale/PIXFixedSale";
import { Global, Sale } from "./entities/schema";

export function handleSaleRequested(event: SaleRequested): void {
  let entity = Global.load("fixedSales");
  if (entity == null) {
    entity = new Global("fixedSales");
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
  sale.type = BigInt.fromI32(1);
  sale.isActive = true;
  sale.requestor = event.params.seller.toHexString();
  sale.tokenIds = event.params.tokenIds;
  sale.price = event.params.price;
  sale.save();
}

export function handleSaleUpdated(event: SaleUpdated): void {
  let sale = Sale.load(getSaleId(event.params.saleId));
  sale.price = event.params.newPrice;
  sale.save();
}

export function handleSaleCancelled(event: SaleCancelled): void {
  let sale = Sale.load(getSaleId(event.params.saleId));
  sale.isActive = false;
  sale.save();

  let entity = Global.load("fixedSales");
  entity.value = entity.value.minus(BigInt.fromI32(1));
  entity.save();

  let salesEntity = Global.load("pixOnSale");
  salesEntity.value = salesEntity.value.plus(
    BigInt.fromI32(sale.tokenIds.length)
  );
  salesEntity.save();
}

export function handleSalePurchased(event: Purchased): void {
  let sale = Sale.load(getSaleId(event.params.saleId));
  createAccount(event.params.buyer);
  sale.taker = event.params.buyer.toHexString();
  sale.isActive = false;
  sale.save();

  let entity = Global.load("fixedSales");
  entity.value = entity.value.minus(BigInt.fromI32(1));
  entity.save();

  let salesEntity = Global.load("pixOnSale");
  salesEntity.value = salesEntity.value.minus(
    BigInt.fromI32(sale.tokenIds.length)
  );
  salesEntity.save();
}

function getSaleId(id: BigInt): string {
  return id.toString();
}
