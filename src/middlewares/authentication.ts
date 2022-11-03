import {BotContext} from "../exoskeleton/context.js";
import {BotMiddlewareBase} from "../exoskeleton/middleware.js";
import {db} from "../database/db.js";
import {UnionMessageEvent} from "../exoskeleton/application.js";


export interface UserInfo {
  username: string,
  password: string,
}

export interface ElectricInfo {
  username: string;
  password: string;
  meterId: string;
}

const AuthenticationMetadataKey = "bot:authentication";

export type Policies = "basic" | "electric"

export class AuthenticationMiddleware extends BotMiddlewareBase {
  async handle(ctx: BotContext, e: UnionMessageEvent): Promise<void> {
    const metadata: Policies | undefined = this.getMetadata(ctx, AuthenticationMetadataKey);
    switch (metadata) {
      case "basic":
        await this.handleBasic(ctx, e);
        break;
      case "electric":
        await this.handleElectric(ctx, e);
        break;
      default:
        break;
    }
    await this.callNext(ctx, e);
  }

  private async handleBasic(ctx: BotContext, e: UnionMessageEvent) {
    const account = await db.getUserAccount(e.sender.user_id.toString());
    if (!account || !account.username || !account.password) {
      ctx.context.stop = true;
      ctx.response.push("请先私聊机器人进行绑定");
      return;
    }
    ctx.context.info.set("auth", account);
  }

  private async handleElectric(ctx: BotContext, e: UnionMessageEvent) {
    const account = await db.getUserMeter(e.sender.user_id.toString());
    if (!account || !account.username || !account.password) {
      ctx.context.stop = true;
      ctx.response.push("请先私聊机器人进行绑定");
      return;
    }
    if (!account.meterId) {
      ctx.context.stop = true;
      ctx.response.push("请私聊机器绑定宿舍");
      return;
    }
    ctx.context.info.set("auth", account);
  }

  static authentication(policy: Policies): MethodDecorator {
    return (target, key, descriptor) => {
      Reflect.defineMetadata(AuthenticationMetadataKey, policy, target, key);
    };
  }
}

export const auth = AuthenticationMiddleware.authentication;
