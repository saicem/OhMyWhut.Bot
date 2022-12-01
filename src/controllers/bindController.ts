import "reflect-metadata";
import {BotContext} from "../exoskeleton/context.js";
import {db} from "../database/db.js";
import {BotControllerBase} from "../middlewares/controllerMapper.js";
import {help} from "./helpController.js";

export class BindController implements BotControllerBase {
  command = "绑定";

  @help("绑定 [学号 {xxx} {xxx}] [宿舍 {xxx}]", "用于绑定信息，方便以后的查询")
  async handle(ctx: BotContext, params: string[]): Promise<void> {
    if (ctx.request.message_type != "private") {
      ctx.response.push("请私聊机器人进行绑定");
    }

    if (params[0] == "学号") {
      const username = params[1];
      const password = params[2];
      if (username == undefined || password == undefined) {
        ctx.response.push("学号或密码缺失");
      } else {
        if (!username.match(/\d{13}/)) {
          ctx.response.push(`学号 ${username} 非法`);
        } else {
          await db.setUserAccount(ctx.request.sender.user_id, username, password);
          ctx.response.push("绑定学号成功");
        }
      }
    }

    if (params[0] == "宿舍") {
      const room = params[1];
      if (room == undefined) {
        ctx.response.push("缺少宿舍信息");
        return;
      }
      const queryResult = await db.getMeterIdFromRoom(room);
      if (queryResult == null) {
        ctx.response.push(`未能查询到宿舍: ${room} 的信息`);
        return;
      }
      const meterId = queryResult.meterId;
      await db.setUserRoom(ctx.request.sender.user_id, meterId);
      ctx.response.push("绑定宿舍成功");
    }

    if (ctx.response.length == 0) {
      ctx.response.push("绑定格式: 绑定 [学号 {xxx} 密码 {xxx}] [宿舍 {xxx}|meter {xxx}]");
    }
  }
}
