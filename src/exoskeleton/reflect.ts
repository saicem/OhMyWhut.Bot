import {BotContext} from "./botContext.js";
import {UnionMessageEvent} from "./middleware.js";

export type FromTags = "private" | "group" | "discuss" | "any"

export function from(type: FromTags) {
  return (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<(ctx: BotContext, e: UnionMessageEvent) => Promise<any>>) => {
    descriptor.value;
    Reflect.defineMetadata("bot:from", type, target, propertyKey);
  };
}

export function getFrom(target: any, propertyKey: string): "private" | "group" | "discuss" | "any" | undefined {
  return Reflect.getMetadata("bot:from", target, propertyKey);
}

export type AuthenticationTags = "basic" | "electric"

export function authentication(policy: AuthenticationTags): MethodDecorator {
  return (target, key, descriptor) => {
    Reflect.defineMetadata("bot:authentication", policy, target, key);
  };
}

export function getAuthentication(target: any, propertyKey: string): "basic" | undefined {
  return Reflect.getMetadata("bot:authentication", target, propertyKey);
}
