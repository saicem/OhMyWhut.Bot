import {BotContext} from "../exoskeleton/context.js";
import {fetcher} from "../request/fastFetcher.js";
import {BotControllerBase} from "../middlewares/controllerMapper.js";
import {db} from "../database/db.js";

export class BookController implements BotControllerBase {
  command = "图书";

  async handle(ctx: BotContext, params: string[]): Promise<void> {
    const user = await db.getUser(ctx.request.user_id);
    if (user == null || user.username == null || user.password == null) {
      ctx.response.push("请先绑定学号");
      return;
    }
    const books = await fetcher.fetchBooks(user.username, user.password);
    ctx.response.push(...[
      `共借阅了 ${books.length} 本书`,
      ...books.map(book => `${book.name}: ${book.borrow.replaceAll("-", "/")}~${book.expire.replaceAll("-", "/")}`),
    ].join("\n"));
  }
}
