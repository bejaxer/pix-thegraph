import { BigInt } from "@graphprotocol/graph-ts";
import { Transfer, PIX as PIXContract } from "./entities/PIX/PIX";
import { Global, Account, PIX, PIXTransfer } from "./entities/schema";
import { createAccount } from "./account";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function handleTransfer(event: Transfer): void {
  if (event.params.tokenId.isZero()) return;

  let entity = Global.load("totalSupply");
  if (entity == null) {
    entity = new Global("totalSupply");
    entity.value = new BigInt(0);
  }
  if (event.params.to.toHexString() == ZERO_ADDRESS) {
    entity.value = entity.value.minus(BigInt.fromI32(1));
  } else if (event.params.from.toHexString() == ZERO_ADDRESS) {
    entity.value = entity.value.plus(BigInt.fromI32(1));
  }
  entity.save();

  if (event.params.from.toHexString() == ZERO_ADDRESS) {
    let contract = PIXContract.bind(event.address);
    let pixInfoResult = contract.pixInfos(event.params.tokenId);
    let pix = new PIX(getPIXId(event.params.tokenId));
    pix.tokenId = event.params.tokenId;
    createAccount(event.params.from);
    createAccount(event.params.to);
    pix.account = event.params.to.toHexString();
    pix.pixId = pixInfoResult.value0;
    pix.category = BigInt.fromI32(pixInfoResult.value1);
    pix.size = BigInt.fromI32(pixInfoResult.value2);
    pix.save();
  } else {
    let pix = PIX.load(getPIXId(event.params.tokenId));
    createAccount(event.params.to);
    pix.account = event.params.to.toHexString();
    pix.save();

    let account = Account.load(event.params.from.toHexString());
    account.balance = account.balance.minus(BigInt.fromI32(1));
    account.save();
  }

  let account = Account.load(event.params.to.toHexString());
  account.balance = account.balance.plus(BigInt.fromI32(1));
  account.save();

  let transferEntity = Global.load("totalTransfer");
  if (transferEntity == null) {
    transferEntity = new Global("totalTransfer");
    transferEntity.value = BigInt.fromI32(0);
  }
  transferEntity.value = transferEntity.value.plus(BigInt.fromI32(1));
  transferEntity.save();

  let transfer = new PIXTransfer(getPIXTransferId(transferEntity.value));
  transfer.transferId = transferEntity.value;
  transfer.pix = getPIXId(event.params.tokenId);
  transfer.from = event.params.from.toHexString();
  transfer.to = event.params.to.toHexString();
  transfer.save();
}

function getPIXId(id: BigInt): string {
  return "PIX - " + id.toString();
}

function getPIXTransferId(id: BigInt): string {
  return "PIXTransfer - " + id.toString();
}
