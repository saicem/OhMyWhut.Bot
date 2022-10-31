import {ChainElem} from "oicq/lib/message/elements.js";

export interface BotContext {
  handlerName: string;
  controller: Object;
  info: Map<string, any>;
  retMsg: (ChainElem | string)[];
  stop: boolean;
}
