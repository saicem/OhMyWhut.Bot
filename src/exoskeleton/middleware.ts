import {BotContext} from "./botContext.js";
import {getUserAccount, getUserMeter} from "../database/user.js";
import {DiscussMessageEvent, GroupMessageEvent, PrivateMessageEvent} from "oicq";
import {AuthenticationTags} from "./reflections/authentication.js";

export type UnionMessageEvent = PrivateMessageEvent | GroupMessageEvent | DiscussMessageEvent

export interface BotMiddleware {
  tag: string;
  handle: (ctx: BotContext, e: UnionMessageEvent, tag: any) => Promise<BotContext>;
}

export class AuthenticationMiddleware implements BotMiddleware {
  async handle(ctx: BotContext, e: UnionMessageEvent, tag: AuthenticationTags | undefined = undefined): Promise<BotContext> {
    if (!tag) {
      return ctx;
    }
    if (tag == "basic") {
      const account = await getUserAccount(e.sender.user_id.toString());
      if (!account || !account.username || !account.password) {
        ctx.stop = true;
        ctx.retMsg.push("请先私聊机器人进行绑定");
        return ctx;
      }
      ctx.info.set("username", account.username);
      ctx.info.set("password", account.password);
    } else if (tag == "electric") {
      const account = await getUserMeter(e.sender.user_id.toString());
      if (!account || !account.username || !account.password) {
        ctx.stop = true;
        ctx.retMsg.push("请先私聊机器人进行绑定");
        return ctx;
      }
      if (!account.meterId) {
        ctx.stop = true;
        ctx.retMsg.push("请私聊机器绑定宿舍");
        return ctx;
      }
      ctx.info.set("username", account.username);
      ctx.info.set("password", account.password);
      ctx.info.set("meterId", account.meterId);
    }
    return ctx;
  }

  tag = "authentication";
}
