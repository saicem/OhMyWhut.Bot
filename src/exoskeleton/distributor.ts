import {TextController} from "./textController.js";
import {getFrom} from "./reflect.js";
import {BotContext} from "./botContext.js";

export interface BotControllerMethods {
  private: string | undefined,
  discuss: string | undefined,
  group: string | undefined,
}

export type BotMethodTagger = (target: any, propertyKey: string) => string;

export type BotMsgHandler = (ctx: BotContext) => any;

export class MessageDistributor {
  controllers: TextController[] = [];
  methodsMap = new WeakMap<TextController, BotControllerMethods>();
  methodTags = new Set<string>();
  taggers: BotMethodTagger[] = [];

  parseController(proto: any) {
    const methods: BotControllerMethods = {
      private: undefined,
      discuss: undefined,
      group: undefined,
    };

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

      for (const tagger of this.taggers) {
        const tag = tagger(proto, key);
        if (tag) {
          this.addMethodTag(key, proto.name, tag);
        }
      }
    }
    return methods;
  }

  /**
   * 添加标记器，用于识别方法的 metadata 并记录
   * @param tagger 标记器
   */
  addTaggers(tagger: BotMethodTagger) {
    this.taggers.push(tagger);
  }

  addMethodTag(method: string, controller: string, tag: string) {
    this.methodTags.add(`${method}:${controller}:${tag}`);
  }

  hasMethodTag(method: string, controller: string, tag: string) {
    return this.methodTags.has(`${method}:${controller}:${tag}`);
  }

  addController<T extends TextController>(controller: T) {
    this.controllers.push(controller);
    this.methodsMap.set(controller, this.parseController(Object.getPrototypeOf(controller)));
  }

  getMethod(msg: string, type: "private" | "discuss" | "group"): BotMsgHandler | undefined {
    const controller = this.controllers.find(controller => controller.match(msg));
    if (!controller) {
      return undefined;
    }
    const methodName = this.methodsMap.get(controller)![type];
    if (!methodName) {
      return undefined;
    }
    return (controller as any)[methodName];
  }
}
