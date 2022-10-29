import {ITextController} from "../exoskeleton/ITextController";
import {authentication, from} from "../exoskeleton/reflect";
import {BotContext} from "../exoskeleton/botContext";

export class CourseController implements ITextController {
  match(msg: string): boolean {
    return false;
  }


  @authentication("basic")
  @from("any")
  handleAny(ctx: BotContext) {

  }
}
