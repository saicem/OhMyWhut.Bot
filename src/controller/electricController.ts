import {BotControllerBase} from "../exoskeleton/controller.js";
import {BotContext} from "../exoskeleton/context.js";
import {fetchElectricFee} from "../request/fastFetcher.js";
import {auth, ElectricInfo} from "../middlewares/authentication.js";
import {from, UnionMessageEvent} from "../exoskeleton/application.js";

export class ElectricController implements BotControllerBase {
  match(msg: string): boolean {
    return msg.startsWith("电费");
  }


  @auth("electric")
  @from("any")
  async handleAny(ctx: BotContext, e: UnionMessageEvent): Promise<void> {
    const {username, password, meterId} = ctx.info.get("auth") as ElectricInfo;
    const res = await fetchElectricFee(username, password, meterId);
    ctx.retMsg.push([
      `剩余电量: ${res.remainPower}`,
      `总用电量: ${res.totalPower}`,
      `剩余电费: ${res.remainFee}`,
    ].join("\n"));
  }
}
