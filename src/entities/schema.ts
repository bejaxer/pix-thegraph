// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Address,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Global extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Global entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Global entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Global", id.toString(), this);
  }

  static load(id: string): Global | null {
    return store.get("Global", id) as Global | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get value(): BigInt {
    let value = this.get("value");
    return value.toBigInt();
  }

  set value(value: BigInt) {
    this.set("value", Value.fromBigInt(value));
  }
}

export class PIXCluster extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save PIXCluster entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save PIXCluster entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("PIXCluster", id.toString(), this);
  }

  static load(id: string): PIXCluster | null {
    return store.get("PIXCluster", id) as PIXCluster | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get tokenId(): BigInt {
    let value = this.get("tokenId");
    return value.toBigInt();
  }

  set tokenId(value: BigInt) {
    this.set("tokenId", Value.fromBigInt(value));
  }

  get pixId(): BigInt {
    let value = this.get("pixId");
    return value.toBigInt();
  }

  set pixId(value: BigInt) {
    this.set("pixId", Value.fromBigInt(value));
  }

  get category(): BigInt {
    let value = this.get("category");
    return value.toBigInt();
  }

  set category(value: BigInt) {
    this.set("category", Value.fromBigInt(value));
  }

  get size(): BigInt {
    let value = this.get("size");
    return value.toBigInt();
  }

  set size(value: BigInt) {
    this.set("size", Value.fromBigInt(value));
  }

  get account(): string {
    let value = this.get("account");
    return value.toString();
  }

  set account(value: string) {
    this.set("account", Value.fromString(value));
  }
}

export class Account extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Account entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Account entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Account", id.toString(), this);
  }

  static load(id: string): Account | null {
    return store.get("Account", id) as Account | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get balance(): BigInt {
    let value = this.get("balance");
    return value.toBigInt();
  }

  set balance(value: BigInt) {
    this.set("balance", Value.fromBigInt(value));
  }

  get clusters(): Array<string | null> {
    let value = this.get("clusters");
    return value.toStringArray();
  }

  set clusters(value: Array<string | null>) {
    this.set("clusters", Value.fromStringArray(value));
  }

  get sales(): Array<string | null> {
    let value = this.get("sales");
    return value.toStringArray();
  }

  set sales(value: Array<string | null>) {
    this.set("sales", Value.fromStringArray(value));
  }

  get purchases(): Array<string | null> {
    let value = this.get("purchases");
    return value.toStringArray();
  }

  set purchases(value: Array<string | null>) {
    this.set("purchases", Value.fromStringArray(value));
  }
}

export class Sale extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id !== null, "Cannot save Sale entity without an ID");
    assert(
      id.kind == ValueKind.STRING,
      "Cannot save Sale entity with non-string ID. " +
        'Considering using .toHex() to convert the "id" to a string.'
    );
    store.set("Sale", id.toString(), this);
  }

  static load(id: string): Sale | null {
    return store.get("Sale", id) as Sale | null;
  }

  get id(): string {
    let value = this.get("id");
    return value.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get type(): BigInt {
    let value = this.get("type");
    return value.toBigInt();
  }

  set type(value: BigInt) {
    this.set("type", Value.fromBigInt(value));
  }

  get isActive(): boolean {
    let value = this.get("isActive");
    return value.toBoolean();
  }

  set isActive(value: boolean) {
    this.set("isActive", Value.fromBoolean(value));
  }

  get requestor(): string {
    let value = this.get("requestor");
    return value.toString();
  }

  set requestor(value: string) {
    this.set("requestor", Value.fromString(value));
  }

  get tokenIds(): Array<BigInt> {
    let value = this.get("tokenIds");
    return value.toBigIntArray();
  }

  set tokenIds(value: Array<BigInt>) {
    this.set("tokenIds", Value.fromBigIntArray(value));
  }

  get price(): BigInt {
    let value = this.get("price");
    return value.toBigInt();
  }

  set price(value: BigInt) {
    this.set("price", Value.fromBigInt(value));
  }

  get taker(): string | null {
    let value = this.get("taker");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set taker(value: string | null) {
    if (value === null) {
      this.unset("taker");
    } else {
      this.set("taker", Value.fromString(value as string));
    }
  }

  get endTime(): BigInt | null {
    let value = this.get("endTime");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set endTime(value: BigInt | null) {
    if (value === null) {
      this.unset("endTime");
    } else {
      this.set("endTime", Value.fromBigInt(value as BigInt));
    }
  }
  get soldDate(): BigInt | null {
    let value = this.get("soldDate");
    if (value === null || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set soldDate(value: BigInt | null) {
    if (value === null) {
      this.unset("soldDate");
    } else {
      this.set("soldDate", Value.fromBigInt(value as BigInt));
    }
  }
}
