import {BotControllerBase} from "../exoskeleton/controller.js";
import {BotContext} from "../exoskeleton/context.js";
import {auth, UserInfo} from "../middlewares/authentication.js";
import {from} from "../exoskeleton/application.js";
import {fetcher} from "../request/fastFetcher.js";

export class BookController implements BotControllerBase {
  match(msg: string): boolean {
    return msg.match(/^(图书|[Bb]ook)$/) != null;
  }

  @auth("basic")
  @from("any")
  async handleAny(ctx: BotContext) {
    const {username, password} = ctx.context.info.get("auth") as UserInfo;
    const books = await fetcher.fetchBooks(username, password);
    ctx.response.push(...[
      `共借阅了 ${books.length} 本书`,
      ...books.map(book => `${book.name}: ${book.borrow.replaceAll("-", "/")}~${book.expire.replaceAll("-", "/")}`),
    ].join("\n"));
  }
}
