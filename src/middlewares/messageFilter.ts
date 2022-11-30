import {BotMiddlewareBase} from "../exoskeleton/middleware.js";
import {BotContext} from "../exoskeleton/context.js";
import {config} from "../config.js";

export class MessageFilter extends BotMiddlewareBase {
  handle(ctx: BotContext): Promise<void> {
    // 长度过滤
    if (ctx.request.raw_message.length > config.filterLength) {
      return Promise.resolve();
    }
    return this.callNext(ctx);
  }
}
