import {BotContext} from "../exoskeleton/context.js";
import {BotControllerBase, BotMsgHandler} from "../middlewares/controllerMapper.js";

export class HelpController implements BotControllerBase {
  command: string = "帮助";

  async handle(ctx: BotContext, params: string[]): Promise<void> {
    if (params[0] == "参数") {
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
        ...commands.map((value, index) => (`${index + 1}. ${value}`)),
      ].join("\n"));
    }
  }
}

const commands: string[] = [];

export function help(usage: string, explain: string) {
  commands.push(usage);

  function getHelpHandler(): ProxyHandler<Function> {
    return {
      apply(target: BotMsgHandler, thisArg: any, argArray: [BotContext, string[]]): any {
        const [ctx, params] = argArray;
        if (params[0] == "帮助") {
          ctx.response.push(`用法: ${usage}\n说明: ${explain}`);
          return;
        }
        return target(...argArray);
      },
    };
  }

  return (target: BotControllerBase, propertyKey: "handle", descriptor: TypedPropertyDescriptor<(ctx: BotContext, params: string[]) => Promise<any>>) => {
    descriptor.value = new Proxy(target[propertyKey], getHelpHandler()) as () => any;
  };
}


