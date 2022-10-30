import {TextController} from "../exoskeleton/textController.js";
import {BotContext} from "../exoskeleton/botContext.js";
import {UnionMessageEvent} from "../exoskeleton/middleware.js";
import {from} from "../exoskeleton/reflections/from.js";

export class HelpController implements TextController {
  match(msg: string): boolean {
    return msg.length < 10 && (msg.startsWith("help") || msg.startsWith("帮助"));
  }

  @from("any")
  async handleAny(ctx: BotContext, e: UnionMessageEvent): Promise<void> {
    const msg = e.raw_message;
    if (msg.match(/参数/)) {
      ctx.retMsg.push(...[
        "参数说明:",
        "xxx: 表示需要自己填写的内容",
        "[ ]: 可选参数",
        "{ }: 必填参数",
        " - : 表示范围，例如 1-20",
        " | : 表示可选，例如 'help|帮助'",
      ]);
    } else {
      ctx.retMsg.push(...[
        "发送 '帮助 参数' 获取参数相关的帮助",
        "可用指令:",
        "1. 绑定 [学号 {xxx} 密码 {xxx}] [宿舍 {xxx}|meter {xxx}]",
        "2. 课表 [日历|ical|1-20]",
        "3. 图书",
        "4. 电费",
        "5. 校园卡余额",
      ]);
    }
  }
}
