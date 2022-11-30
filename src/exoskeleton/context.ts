import {ChainElem} from "oicq/lib/message/elements.js";
import {UnionMessageEvent} from "./application.js";

export interface BotContext {
  request: UnionMessageEvent;
  data: Map<Symbol, any>;
  response: (ChainElem | string)[];
}
