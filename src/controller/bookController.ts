import {TextController} from "../exoskeleton/textController.js";
import {authentication, from} from "../exoskeleton/reflect.js";
import {BotContext} from "../exoskeleton/botContext.js";
import {fetchBooks} from "../request/fastFetcher.js";
import {UnionMessageEvent} from "../exoskeleton/middleware.js";

export class BookController implements TextController {
  match(msg: string): boolean {
    return msg.match(/^图书|^[Bb]ook/) != null;
  }

  @authentication("basic")
  @from("any")
  async handleAny(ctx: BotContext, e: UnionMessageEvent) {
    const username = ctx.info.get("username");
    const password = ctx.info.get("password");
    const {books} = await fetchBooks(username, password);
    ctx.retMsg.push(...[
      `一共借阅了${books.length}本书`,
      ...books.map(book => `${book.name}: ${book.borrow}-${book.expire}`),
    ]);
  }
}
