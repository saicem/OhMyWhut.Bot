import {BotMiddlewareBase} from "../exoskeleton/middleware.js";
import {BotContext} from "../exoskeleton/context.js";

export class ControllerMapper extends BotMiddlewareBase {
  controllerJar = new Map<string, BotControllerBase>();

  handle(ctx: BotContext): Promise<void> {
    const [entry, ...params] = ctx.request.raw_message.split(/\s+/);
    const ctl = this.controllerJar.get(entry);
    if (ctl == undefined) {
      return Promise.resolve();
    }

    return ctl.handle(ctx, params);
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

  /**
   * 处理
   * @param ctx
   * @param params
   */
  handle(ctx: BotContext, params: string[]): Promise<void>;
}

