import {BotContext} from "./botContext.js";
import {authentication} from "./reflect.js";
import {getUserAccount} from "../database/user.js";
import {DiscussMessageEvent, GroupMessageEvent, PrivateMessageEvent} from "oicq";

export type UnionMessageEvent = PrivateMessageEvent | GroupMessageEvent | DiscussMessageEvent

export interface BotMiddleware {
  tag: string;
  handle: (ctx: BotContext, e: UnionMessageEvent, tag: string | undefined) => Promise<BotContext>;
}

export class AuthenticationMiddleware implements BotMiddleware {
  async handle(ctx: BotContext, e: UnionMessageEvent, tag: string | undefined = undefined): Promise<BotContext> {
    if (!tag) {
      return ctx;
    }
    // todo 获取 tag
    const account = await getUserAccount(e.sender.user_id.toString());
    if (!account) {
      ctx.stop = true;
      ctx.retMsg.push("请先私聊机器人进行绑定");
      return ctx;
    }
    ctx.info.set("username", account.username);
    ctx.info.set("password", account.password);
    return ctx;
  }

  tag = "authentication";
}
