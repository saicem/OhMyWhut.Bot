import {TextController} from "../exoskeleton/textController.js";
import {setUserAccount, setUserRoom} from "../database/user.js";
import {BotContext} from "../exoskeleton/botContext.js";
import {UnionMessageEvent} from "../exoskeleton/middleware.js";
import {from} from "../exoskeleton/reflections/from.js";
import {getMeterIdFromRoom} from "../database/room.js";

export class BindController implements TextController {
  match(msg: string): boolean {
    return msg.startsWith("绑定");
  }

  @from("private")
  async handlePrivate(ctx: BotContext, e: UnionMessageEvent): Promise<void> {
    const msg = e.raw_message;

    if (msg.match(/学号/)) {
      const username = msg.match(/学号\s*(\d+?\b)/)?.[1];
      const password = msg.match(/密码\s*(.+?\b)/)?.[1];
      if (username == undefined || password == undefined) {
        ctx.retMsg.push("学号或密码缺失");
      } else {
        if (username.length != 13) {
          ctx.retMsg.push(`学号 ${username} 非法`);
        } else {
          await setUserAccount(e.sender.user_id.toString(), username, password);
          ctx.retMsg.push("绑定学号成功");
        }
      }
    }

    if (msg.match(/宿舍|meter/)) {
      const room = msg.match(/宿舍\s*(.{1,10}?-\d+)/)?.[1];
      let meterId = msg.match(/meter\s*(.+?\b)/)?.[1];
      if (room != null) {
        const queryResult = await getMeterIdFromRoom(room);
        if (queryResult == null) {
          ctx.retMsg.push(`未能查询到宿舍: ${room} 的信息`);
        } else {
          meterId = queryResult.meterId;
        }
      }
      if (meterId != null) {
        await setUserRoom(e.sender.user_id.toString(), meterId);
        ctx.retMsg.push("绑定宿舍成功");
      }
    }

    if (ctx.retMsg.length == 0) {
      ctx.retMsg.push("绑定格式: 绑定 [学号 {xxx} 密码 {xxx}] [宿舍 {xxx}|meter {xxx}]");
    }
  }

  @from("any")
  async handleGroup(ctx: BotContext, e: UnionMessageEvent): Promise<void> {
    ctx.retMsg.push("请私聊机器人进行绑定");
  }
}
