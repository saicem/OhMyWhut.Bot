import "reflect-metadata";
import {BotControllerBase} from "../exoskeleton/controller.js";
import {BotContext} from "../exoskeleton/context.js";
import {db} from "../database/db.js";
import {from} from "../exoskeleton/application.js";

export class BindController implements BotControllerBase {
  match(msg: string): boolean {
    return msg.match(/绑定(?!\S)/) != null;
  }

  @from("private")
  async handlePrivate(ctx: BotContext): Promise<void> {
    const msg = ctx.request.raw_message;

    if (msg.match(/学号/)) {
      const username = msg.match(/学号\s*(\d+?\b)/)?.[1];
      const password = msg.match(/密码\s*(\S+?)/)?.[1];
      if (username == undefined || password == undefined) {
        ctx.response.push("学号或密码缺失");
      } else {
        if (username.length != 13) {
          ctx.response.push(`学号 ${username} 非法`);
        } else {
          await db.setUserAccount(ctx.request.sender.user_id.toString(), username, password);
          ctx.response.push("绑定学号成功");
        }
      }
    }

    if (msg.match(/宿舍|meter/)) {
      const room = msg.match(/宿舍\s*(.{1,10}?-\d+)/)?.[1];
      let meterId = msg.match(/meter\s*(.+?\b)/)?.[1];
      if (room != null) {
        const queryResult = await db.getMeterIdFromRoom(room);
        if (queryResult == null) {
          ctx.response.push(`未能查询到宿舍: ${room} 的信息`);
        } else {
          meterId = queryResult.meterId;
        }
      }
      if (meterId != null) {
        await db.setUserRoom(ctx.request.sender.user_id.toString(), meterId);
        ctx.response.push("绑定宿舍成功");
      }
    }

    if (ctx.response.length == 0) {
      ctx.response.push("绑定格式: 绑定 [学号 {xxx} 密码 {xxx}] [宿舍 {xxx}|meter {xxx}]");
    }
  }

  @from("any")
  async handleGroup(ctx: BotContext): Promise<void> {
    ctx.response.push("请私聊机器人进行绑定");
  }
}
