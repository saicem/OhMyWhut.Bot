import {TextController} from "./textController.js";
import {BotContext} from "./botContext.js";
import {BotMiddleware} from "./middleware.js";
import config from "../config.js";
import {DiscussMessageEvent, GroupMessageEvent, PrivateMessageEvent} from "oicq";
import {getFrom} from "./reflections/from.js";

export interface BotControllerMethods {
  private: string | undefined,
  discuss: string | undefined,
  group: string | undefined,
}

export type BotMsgHandler = (ctx: BotContext, e: DiscussMessageEvent | GroupMessageEvent | PrivateMessageEvent) => Promise<void>;

// TODO too heavy，考虑重构
export class MessageDistributor {
  controllers: TextController[] = [];
  methodsMap = new WeakMap<TextController, BotControllerMethods>();
  methodTags = new Map<string, string>();
  middlewares: BotMiddleware[] = [];

  parseController(proto: any) {
    const methods: BotControllerMethods = {
      private: undefined,
      discuss: undefined,
      group: undefined,
    };

    const tags = this.middlewares.map(x => x.tag);

    for (const key of Object.getOwnPropertyNames(proto)) {
      if (typeof proto[key] != "function") continue;

      const fromType = getFrom(proto, key);
      if (fromType == undefined) continue;
      if (fromType == "any") {
        if (methods.private == undefined) methods.private = key;
        if (methods.discuss == undefined) methods.discuss = key;
        if (methods.group == undefined) methods.group = key;
      } else {
        methods[fromType] = key;
      }

      const controllerName = proto.constructor.name;
      for (const tag of tags) {
        const data = Reflect.getMetadata(`bot:${tag}`, proto, key);
        if (data) {
          this.setMethodTagData(controllerName, key, tag, data);
        }
      }
    }
    return methods;
  }

  setMethodTagData(controller: string, method: string, tag: string, data: string) {
    this.methodTags.set(`${controller}:${method}:${tag}`, data);
  }

  getMethodTagData(controller: string, method: string, tag: string) {
    return this.methodTags.get(`${controller}:${method}:${tag}`);
  }

  addController<T extends TextController>(controller: T) {
    this.controllers.push(controller);
    this.methodsMap.set(controller, this.parseController(Object.getPrototypeOf(controller)));
  }

  addMiddleware(middleware: BotMiddleware) {
    this.middlewares.push(middleware);
  }

  async handleTextMessage(e: PrivateMessageEvent | GroupMessageEvent | DiscussMessageEvent): Promise<void> {
    // 过滤长消息
    if (e.raw_message.length > config.filterLength) return;

    const controller = this.controllers.find(controller => controller.match(e.raw_message));
    if (!controller) return;

    const methodName = this.methodsMap.get(controller)![e.message_type];
    if (!methodName) return;

    // todo 上方添加过滤器
    const ctx: BotContext = {info: new Map<string, string>(), retMsg: [], stop: false};

    const controllerName = Object.getPrototypeOf(controller).constructor.name;
    for (const middleware of this.middlewares) {
      const data = this.getMethodTagData(controllerName, methodName, middleware.tag);
      await middleware.handle(ctx, e, data);
      if (ctx.stop) break;
    }

    if (!ctx.stop) {
      // todo 如何补全类型
      await ((controller as any)[methodName] as BotMsgHandler)(ctx, e);
    }

    if (ctx.retMsg.length) {
      await e.reply(ctx.retMsg.join("\n"), true);
    }
  }
}
