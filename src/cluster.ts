import { BigInt } from "@graphprotocol/graph-ts";
import {
  Transfer,
  PIXCluster as PIXClusterContract,
} from "./entities/PIXCluster/PIXCluster";
import { Global, Account, PIXCluster } from "./entities/schema";
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
    let contract = PIXClusterContract.bind(event.address);
    let pixInfoResult = contract.pixInfos(event.params.tokenId);
    let cluster = new PIXCluster(getPIXClusterId(event.params.tokenId));
    cluster.tokenId = event.params.tokenId;
    createAccount(event.params.to);
    cluster.account = event.params.to.toHexString();
    cluster.pixId = pixInfoResult.value0;
    cluster.category = pixInfoResult.value1;
    cluster.size = pixInfoResult.value2;
    cluster.save();
  } else {
    let cluster = PIXCluster.load(getPIXClusterId(event.params.tokenId));
    createAccount(event.params.to);
    cluster.account = event.params.to.toHexString();
    cluster.save();

    let account = Account.load(event.params.from.toHexString());
    account.balance = account.balance.minus(BigInt.fromI32(1));
    account.save();
  }

  let account = Account.load(event.params.to.toHexString());
  account.balance = account.balance.plus(BigInt.fromI32(1));
  account.save();
}

function getPIXClusterId(id: BigInt): string {
  return "PIXCluster - " + id.toString();
}
