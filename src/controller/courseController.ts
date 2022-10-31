import {BotControllerBase} from "../exoskeleton/controller.js";
import {BotContext} from "../exoskeleton/context.js";
import {auth} from "../middlewares/authentication.js";
import {from, UnionMessageEvent} from "../exoskeleton/application.js";

export class CourseController implements BotControllerBase {
  match(msg: string): boolean {
    return false;
  }


  @auth("basic")
  @from("any")
  async handleAny(ctx: BotContext, e: UnionMessageEvent): Promise<void> {

  }
}
