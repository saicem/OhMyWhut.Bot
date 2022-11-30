import {BotContext} from "./context.js";

export abstract class BotMiddlewareBase {
  protected nextHandler: BotMiddlewareBase | undefined;

  public setNext(next: BotMiddlewareBase) {
    this.nextHandler = next;
  }

  public abstract handle(ctx: BotContext): Promise<void>;

  protected async callNext(ctx: BotContext) {
    await this.nextHandler?.handle(ctx);
  }
}
