import {TextController} from "../exoskeleton/textController.js";
import {authentication} from "../exoskeleton/reflections/authentication.js";
import {from} from "../exoskeleton/reflections/from.js";
import {BotContext} from "../exoskeleton/botContext.js";
import {UnionMessageEvent} from "../exoskeleton/middleware.js";
import {fetchElectricFee} from "../request/fastFetcher.js";

export class ElectricController implements TextController {
  match(msg: string): boolean {
    return msg.startsWith("电费");
  }


  @authentication("electric")
  @from("any")
  async handleAny(ctx: BotContext, e: UnionMessageEvent): Promise<void> {
    const username = ctx.info.get("username");
    const password = ctx.info.get("password");
    const meterId = ctx.info.get("meterId");
    const res = await fetchElectricFee(username, password, meterId);
    ctx.retMsg.push(`剩余电量: ${res.remainPower}`);
    ctx.retMsg.push(`剩余电费: ${res.remainFee}`);
  }
}
