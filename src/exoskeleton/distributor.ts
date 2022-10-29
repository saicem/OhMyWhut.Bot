import {TextController} from "./textController.js";
import {getFrom} from "./reflect.js";

export interface BotControllerMethods {
  private: string[],
  discuss: string[],
  group: string[],
  any: string[]
}

function parseDict(proto: any) {
  const dic: BotControllerMethods = {
    private: [],
    discuss: [],
    group: [],
    any: [],
  };
  for (const key of Object.getOwnPropertyNames(proto)) {
    if (typeof proto[key] != "function") continue;
    const fromType = getFrom(proto, key);
    if (fromType == undefined) continue;
    dic[fromType].push(key);
  }
  return dic;
}

export class MessageDistributor {
  controllers: TextController[] = [];
  methods = new WeakMap<TextController, BotControllerMethods>();

  addController<T extends TextController>(controller: T) {
    this.controllers.push(controller);
    this.methods.set(controller, parseDict(Object.getPrototypeOf(controller)));
  }

  getController(msg: string) {
    for (const controller of this.controllers) {
      if (controller.match(msg)) {
        return controller;
      }
    }
  }

  getMethods<T extends TextController>(controller: T) {
    return this.methods.get(controller);
  }
}
