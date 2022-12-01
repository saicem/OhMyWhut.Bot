import {BotContext} from "../exoskeleton/context.js";
import {fetcher} from "../request/fastFetcher.js";
import {db} from "../database/db.js";
import {BotControllerBase} from "../middlewares/controllerMapper.js";
import {help} from "./helpController.js";

export class CardMoneyController implements BotControllerBase {
  command = "校园卡余额";

  @help("校园卡余额", "查询校园卡余额")
  async handle(ctx: BotContext, params: string[]): Promise<void> {
    const user = await db.getUser(ctx.request.user_id);
    if (user == null || user.username == null || user.password == null) {
      ctx.response.push("请先绑定学号");
      return;
    }
    const moneyString = await fetcher.fetchCardMoney(user.username, user.password);
    ctx.response.push(`余额: ${moneyString}`);
  }
}
