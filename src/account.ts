import { Address, BigInt, log } from "@graphprotocol/graph-ts";
import { Account } from "./entities/schema";

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function createAccount(addr: Address): void {
  let account = Account.load(addr.toHexString());

  if (account == null) {
    account = new Account(addr.toHexString());
    account.balance = BigInt.fromI32(0);
  }

  account.save();
}
