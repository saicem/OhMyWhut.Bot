import {BotControllerBase} from "../exoskeleton/controller.js";
import {BotContext} from "../exoskeleton/context.js";
import {from} from "../exoskeleton/application.js";

export class HelpController implements BotControllerBase {
  match(msg: string): boolean {
    return msg.length < 10 && msg.match(/^(help|帮助)(?!\S)/) != null;
  }

  @from("any")
  async handleAny(ctx: BotContext): Promise<void> {
    const msg = ctx.request.raw_message;
    if (msg.match(/参数/)) {
      ctx.response.push([
        "参数说明:",
        "xxx: 表示需要自己填写的内容",
        "[ ]: 可选参数",
        "{ }: 必填参数",
        " - : 表示范围，例如 1-20",
        " | : 表示可选，例如 'help|帮助'",
      ].join("\n"));
    } else {
      ctx.response.push([
        "发送 '帮助 参数' 获取参数相关的帮助",
        "可用指令:",
        "1. 绑定 [学号 {xxx} 密码 {xxx}] [宿舍 {xxx:东1-101,智2-202}|meter {xxx}]",
        "2. 课表 [日历|1-20] [刷新]",
        "3. 图书",
        "4. 电费",
        "5. 校园卡余额",
      ].join("\n"));
    }
  }
}
