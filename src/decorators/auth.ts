import {BotContext} from "../exoskeleton/context.js";
import {db} from "../database/db.js";

export type AuthTags = "basic" | "electric";

export function auth(tag: AuthTags, msg: string = "验证失败") {
  return (target: object, key: string | symbol, descriptor: TypedPropertyDescriptor<(ctx: BotContext, params: string[]) => Promise<any>>) => {

    function authenticatioin(tag: AuthTags, msg: string): ProxyHandler<Function> {
      return {
        async apply(target: Function, thisArg: any, argArray: any[]): Promise<any> {
          const [ctx] = argArray as [BotContext, string[]];
          const qq = ctx.request.user_id;
          const user = await db.getUser(qq);
          if (user == undefined) {
            ctx.response.push(msg);
          } else if (tag == "basic" && user.username) {
            ctx.response.push(msg);
          } else if (tag == "electric" && user.username) {
            ctx.response.push(msg);
          } else {
            return target(...argArray);
          }
        },
      };
    }

    if (descriptor.hasOwnProperty("get") && descriptor.get) {
      descriptor.get = new Proxy(target[key as keyof typeof target], authenticatioin(tag, msg)) as () => any;
    } else {
      throw new Error("Can't set cache decorator on a setter");
    }
  };
}
