import {DiscussMessageEvent, GroupMessageEvent, PrivateMessageEvent} from "oicq";
import {BotMiddlewareBase} from "./middleware.js";
import {BotControllerBase} from "../middlewares/controllerMapper.js";

export type UnionMessageEvent = PrivateMessageEvent | GroupMessageEvent | DiscussMessageEvent

export interface BotControllerMethods {
  private: string | undefined,
  discuss: string | undefined,
  group: string | undefined,
}

export class BotApplication {
  controllers: BotControllerBase[] = [];
  methodsMap = new WeakMap<BotControllerBase, BotControllerMethods>();
  middlewares: BotMiddlewareBase[] = [];

  addMiddleware(middleware: BotMiddlewareBase) {
    if (this.middlewares.length) {
      this.middlewares[this.middlewares.length - 1].setNext(middleware);
    }
    this.middlewares.push(middleware);
  }

  async handleTextMessage(e: UnionMessageEvent): Promise<void> {
    await this.middlewares[0].handle({request: e, data: new Map(), response: []});
  }
}
