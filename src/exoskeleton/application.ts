import {BotControllerBase} from "./controller.js";
import {BotContext} from "./context.js";
import config from "../config.js";
import {DiscussMessageEvent, GroupMessageEvent, PrivateMessageEvent} from "oicq";
import {BotMiddlewareBase} from "./middleware.js";

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

  parseMethods(proto: any) {
    const methods: BotControllerMethods = {
      private: undefined,
      discuss: undefined,
      group: undefined,
    };

    for (const key of Object.getOwnPropertyNames(proto)) {
      if (typeof proto[key] != "function") continue;
      const type = BotApplication.getFromMetadata(proto, key);
      if (type == undefined) continue;
      if (type == "private") methods.private = key;
      else if (type == "discuss") methods.discuss = key;
      else if (type == "group") methods.group = key;
      else if (type == "any") {
        if (methods.private == undefined) methods.private = key;
        if (methods.discuss == undefined) methods.discuss = key;
        if (methods.group == undefined) methods.group = key;
      }
    }

    return methods;
  }

  addController<T extends BotControllerBase>(controller: T) {
    this.controllers.push(controller);
    this.methodsMap.set(controller, this.parseMethods(Object.getPrototypeOf(controller)));
  }

  addMiddleware(middleware: BotMiddlewareBase) {
    if (this.middlewares.length) {
      this.middlewares[-1].setNext(middleware);
    }
    this.middlewares.push(middleware);
  }

  async handleTextMessage(e: UnionMessageEvent): Promise<void> {
    // 过滤长消息
    if (e.raw_message.length > config.filterLength) return;

    const controller = this.controllers.find(controller => controller.match(e.raw_message));
    if (!controller) return;

    const handlerName = this.methodsMap.get(controller)![e.message_type];
    if (!handlerName) return;

    // todo 上方添加过滤器
    const ctx: BotContext = {
      controller: controller,
      handlerName: handlerName,
      info: new Map<string, string>(),
      retMsg: [],
      stop: false,
    };

    if (this.middlewares) {
      await this.middlewares[0].handle(ctx, e);
    }

    if (!ctx.stop) {
      await ((controller as any)[handlerName] as BotMsgHandler)(ctx, e);
    }

    if (ctx.retMsg.length) {
      await e.reply(ctx.retMsg, true);
    }
  }

  private static getFromMetadata(target: any, propertyKey: string): "private" | "discuss" | "group" | "any" | undefined {
    return Reflect.getMetadata(`${appMetadataKey}`, target, propertyKey);
  }
}

export function from(type: "private" | "discuss" | "group" | "any") {
  return (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<(ctx: BotContext, e: UnionMessageEvent) => Promise<any>>) => {
    descriptor.value;
    Reflect.defineMetadata(`${appMetadataKey}`, type, target, propertyKey);
  };
}
