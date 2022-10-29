import {from} from "../exoskeleton/reflect.js";
import {TextController} from "../exoskeleton/textController.js";
import {setUserAccount, setUserRoom} from "../database/user.js";
import {BotContext} from "../exoskeleton/botContext.js";

export class BindController implements TextController {
  match(msg: string): boolean {
    return msg.startsWith("绑定");
  }

  @from("private")
  async handlePrivate(ctx: BotContext): Promise<void> {
    const msg = ctx.e.raw_message;
    const retMsgs = [];

    if (msg.match(/学号/)) {
      const username = msg.match(/学号\s*(\d+?\b)/)?.[1];
      const password = msg.match(/密码\s*(.+?\b)/)?.[1];
      if (username == undefined || password == undefined) {
        retMsgs.push("学号或密码缺失");
      } else {
        if (username.length != 13) {
          retMsgs.push(`学号 ${username} 非法`);
        } else {
          await setUserAccount(ctx.e.sender.user_id, username, password);
          retMsgs.push("绑定学号成功");
        }
      }
    }
    if (msg.match(/宿舍|meter/)) {
      const room = msg.match(/宿舍\s*(\d+?\b)/)?.[1];
      const meterId = msg.match(/meter\s*(.+?\b)/)?.[1];
      if (room != null) {
        // todo 从数据库查询电表
      }
      if (meterId != null) {
        await setUserRoom(ctx.e.sender.user_id, meterId);
        retMsgs.push("绑定宿舍成功");
      }
    }

    if (retMsgs.length == 0) {
      retMsgs.push("绑定格式: 绑定 [学号 {xxx} 密码 {xxx}] [宿舍 {xxx}|meter {xxx}]");
    }
    await ctx.e.reply(retMsgs.join("\n"));
  }

  @from("group")
  async handleGroup(ctx: BotContext): Promise<void> {
    await ctx.e.reply("请私聊机器人进行绑定");
  }

  @from("discuss")
  async handleDiscuss(ctx: BotContext): Promise<void> {
    await ctx.e.reply("请私聊机器人进行绑定");
  }
}
