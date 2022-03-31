import { BigInt, ethereum } from "@graphprotocol/graph-ts";
import { AskRemoved, AskCreated, Ask, Punk } from "../../generated/schema";
import { getGlobalId } from "../utils";

export function createAskCreated(
  punkIndex: BigInt,
  event: ethereum.Event
): AskCreated {
  let askCreated = new AskCreated(getGlobalId(event).concat("-ASK_CREATED"));

  askCreated.type = "ASK_CREATED";
  askCreated.nft = punkIndex.toString();
  askCreated.timestamp = event.block.timestamp;
  askCreated.blockNumber = event.block.number;
  askCreated.txHash = event.transaction.hash;
  askCreated.blockHash = event.block.hash;
  askCreated.contract = event.address.toHexString();
  askCreated.save();

  return askCreated as AskCreated;
}

export function createAskRemoved(
  punkIndex: BigInt,
  event: ethereum.Event
): AskRemoved {
  let askRemoved = new AskRemoved(getGlobalId(event).concat("-ASK_REMOVED"));

  askRemoved.type = "ASK_REMOVED";
  askRemoved.nft = punkIndex.toString();
  askRemoved.timestamp = event.block.timestamp;
  askRemoved.blockNumber = event.block.number;
  askRemoved.txHash = event.transaction.hash;
  askRemoved.blockHash = event.block.hash;
  askRemoved.contract = event.address.toHexString();
  askRemoved.save();

  return askRemoved as AskRemoved;
}

export function getLatestAskId(punk: Punk): string {
  //Get latest AskID from Punk entity
  let latestId = punk.currentAsk; // There is always a punk after AssignEvent
  if (latestId !== null) {
    return latestId as string;
  }
}

export function getOrCreateAsk(
  fromAddress: string,
  event: ethereum.Event
): Ask {
  let askId = getGlobalId(event).concat("-ASK"); // -ASK, To prevent conflict with interfaces with same ID
  let ask = Ask.load(askId);
  if (!ask) {
    ask = new Ask(askId);
    ask.from = fromAddress;
    ask.open = true;
    ask.save(); //We have a new Ask entity in the store incase we need the ID elsewhere
  }

  //ask.created = "" // non-nullable, needs to be the id of createBidCreated in same handler
  //nft - needs to be updated from somewhere else
  //amount: BigInt! - needs to be updated from somewhere else
  //ask.removed = "" //needs to be the id of createBidRemoved in same handler

  ask.offerType = "ASK";
  ask.save();

  return ask as Ask;
}
