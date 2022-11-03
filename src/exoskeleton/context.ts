import {ChainElem} from "oicq/lib/message/elements.js";
import {UnionMessageEvent} from "./application.js";

export interface BotContext {
  request: UnionMessageEvent;
  context: {
    handlerName: string;
    controller: Object;
    info: Map<string, any>;
    stop: boolean;
  };
  response: (ChainElem | string)[];
}
