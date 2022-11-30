import {BotContext} from "./context.js";
import {DiscussMessageEvent, GroupMessageEvent, PrivateMessageEvent} from "oicq";
import {BotMiddlewareBase} from "./middleware.js";
import {BotControllerBase} from "../middlewares/controllerMapper.js";

export type UnionMessageEvent = PrivateMessageEvent | GroupMessageEvent | DiscussMessageEvent

export interface BotControllerMethods {
  private: string | undefined,
  discuss: string | undefined,
  group: string | undefined,
}

export type BotMsgHandler = (ctx: BotContext, e: UnionMessageEvent) => Promise<void>;

const appMetadataKey = "bot:app";

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

  // private static getFromMetadata(target: any, propertyKey: string): "private" | "discuss" | "group" | "any" | undefined {
  //   return Reflect.getMetadata(`${appMetadataKey}`, target, propertyKey);
  // }
}

// export;
//
// function;
//
// from(type
// :
// "private" | "discuss" | "group" | "any";
// )
// {
//   return (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<(ctx: BotContext) => Promise<any>>) => {
//     descriptor.value;
//     Reflect.defineMetadata(`${appMetadataKey}`, type, target, propertyKey);
//   };
// }
