import {BotContext} from "../exoskeleton/context.js";
import {fetcher} from "../request/fastFetcher.js";
import {db} from "../database/db.js";
import {BotControllerBase} from "../middlewares/controllerMapper.js";
import {help} from "./helpController.js";

export class ElectricController implements BotControllerBase {
  command: string = "电费";

  @help("电费", "查询电费")
  async handle(ctx: BotContext, params: string[]): Promise<void> {
    const user = await db.getUser(ctx.request.user_id);
    if (user == null || user.username == null || user.password == null || user.meterId == null) {
      ctx.response.push("需要绑定学号及宿舍");
      return;
    }
    const res = await fetcher.fetchElectricFee(user.username, user.password, user.meterId);
    ctx.response.push([
      `剩余电量: ${res.remainPower}`,
      `总用电量: ${res.totalPower}`,
      `剩余电费: ${res.remainFee}`,
    ].join("\n"));
  }
}
