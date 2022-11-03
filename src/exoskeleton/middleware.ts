import {BotContext} from "./context.js";
import {UnionMessageEvent} from "./application.js";


export abstract class BotMiddlewareBase {
  protected nextHandler: BotMiddlewareBase | undefined;

  public setNext(next: BotMiddlewareBase) {
    this.nextHandler = next;
  }

  public abstract handle(ctx: BotContext, e: UnionMessageEvent): Promise<void>;

  protected getMetadata(ctx: BotContext, key: string) {
    return Reflect.getMetadata(key, Object.getPrototypeOf(ctx.context.controller), ctx.context.handlerName);
  }

  protected async callNext(ctx: BotContext, e: UnionMessageEvent) {
    if (this.nextHandler && !ctx.context.stop) {
      await this.nextHandler.handle(ctx, e);
    }
  }
}
