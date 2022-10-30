import {TextController} from "../exoskeleton/textController.js";
import {authentication, from} from "../exoskeleton/reflect.js";
import {BotContext} from "../exoskeleton/botContext.js";
import {UnionMessageEvent} from "../exoskeleton/middleware.js";

export class CourseController implements TextController {
  match(msg: string): boolean {
    return false;
  }


  @authentication("basic")
  @from("any")
  async handleAny(ctx: BotContext, e: UnionMessageEvent): Promise<void> {

  }
}
