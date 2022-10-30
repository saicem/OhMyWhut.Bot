import {TextController} from "../exoskeleton/textController.js";
import {BotContext} from "../exoskeleton/botContext.js";
import {fetchCardMoney} from "../request/fastFetcher.js";
import {UnionMessageEvent} from "../exoskeleton/middleware.js";
import {authentication} from "../exoskeleton/reflections/authentication.js";
import {from} from "../exoskeleton/reflections/from.js";

export class CardMoneyController implements TextController {
  match(msg: string): boolean {
    return msg.startsWith("校园卡余额");
  }

  @authentication("basic")
  @from("any")
  async handleAny(ctx: BotContext, e: UnionMessageEvent) {
    const username = ctx.info.get("username");
    const password = ctx.info.get("password");
    const moneyString = await fetchCardMoney(username, password);
    ctx.retMsg.push(`余额: ${moneyString}`);
  }
}
