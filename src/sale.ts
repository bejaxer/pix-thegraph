import { BigInt } from "@graphprotocol/graph-ts";
import { createAccount } from "./account";
import {
  SaleRequested,
  SaleUpdated,
  SaleCancelled,
  Purchased,
} from "./entities/PIXFixedSale/PIXFixedSale";
import { Global, Sale, SaleLog, PIX } from "./entities/schema";

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

export function handleSalePurchased(event: Purchased): void {
  let sale = Sale.load(getSaleId(event.params.saleId));
  createAccount(event.params.buyer);
  sale.taker = event.params.buyer.toHexString();
  sale.isActive = false;
  sale.soldDate = event.block.timestamp;
  sale.save();

  let entity = Global.load("fixedSales");
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
  return "F" + id.toString();
}

function getPIXId(id: BigInt): string {
  return "PIX - " + id.toString();
}
