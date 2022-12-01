import {BotMiddlewareBase} from "../exoskeleton/middleware.js";
import {BotContext} from "../exoskeleton/context.js";

export class ControllerMapper extends BotMiddlewareBase {
  controllerJar = new Map<string, BotControllerBase>();

  async handle(ctx: BotContext): Promise<void> {
    const [entry, ...params] = ctx.request.raw_message.split(/\s+/);
    const ctl = this.controllerJar.get(entry);
    if (ctl == undefined) {
      return Promise.resolve();
    }

    await ctl.handle(ctx, params);

    await this.callNext(ctx);

    if (ctx.response.length > 0) {
      await ctx.request.reply(ctx.response);
    }
    return;
  }

  addController(controller: BotControllerBase) {
    this.controllerJar.set(controller.command, controller);
  }
}

export interface BotControllerBase {
  /**
   * 匹配指令
   */
  command: string;

  handle: BotMsgHandler;
}

export type BotMsgHandler = (ctx: BotContext, params: string[]) => Promise<void>

