import {DiscussMessageEvent, GroupMessageEvent, PrivateMessageEvent} from "oicq";

export interface BotContext {
  e: PrivateMessageEvent | DiscussMessageEvent | GroupMessageEvent;
  info: Map<string, any>;
};
