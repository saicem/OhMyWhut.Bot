import {BotControllerBase} from "../exoskeleton/controller.js";
import {BotContext} from "../exoskeleton/context.js";
import {from, UnionMessageEvent} from "../exoskeleton/application.js";
import {auth, UserInfo} from "../middlewares/authentication.js";
import {fetcher} from "../request/fastFetcher.js";

export class CardMoneyController implements BotControllerBase {
  match(msg: string): boolean {
    return msg.startsWith("校园卡余额");
  }

  @auth("basic")
  @from("any")
  async handleAny(ctx: BotContext) {
    const {username, password} = ctx.context.info.get("auth") as UserInfo;
    const moneyString = await fetcher.fetchCardMoney(username, password);
    ctx.response.push(`余额: ${moneyString}`);
  }
}
