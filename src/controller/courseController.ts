import {TextController} from "../exoskeleton/textController";
import {authentication, from} from "../exoskeleton/reflect";
import {BotContext} from "../exoskeleton/botContext";

export class CourseController implements TextController {
  match(msg: string): boolean {
    return false;
  }


  @authentication("basic")
  @from("any")
  handleAny(ctx: BotContext) {

  }
}
