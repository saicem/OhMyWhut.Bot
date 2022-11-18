import {BotControllerBase} from "../exoskeleton/controller.js";
import {BotContext} from "../exoskeleton/context.js";
import {auth, ElectricInfo} from "../middlewares/authentication.js";
import {from} from "../exoskeleton/application.js";
import {fetcher} from "../request/fastFetcher.js";

export class ElectricController implements BotControllerBase {
  match(msg: string): boolean {
    return msg == "电费";
  }

  @auth("electric")
  @from("any")
  async handleAny(ctx: BotContext): Promise<void> {
    const {username, password, meterId} = ctx.context.info.get("auth") as ElectricInfo;
    const res = await fetcher.fetchElectricFee(username, password, meterId);
    ctx.response.push([
      `剩余电量: ${res.remainPower}`,
      `总用电量: ${res.totalPower}`,
      `剩余电费: ${res.remainFee}`,
    ].join("\n"));
  }
}
