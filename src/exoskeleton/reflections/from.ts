import {BotContext} from "../botContext.js";
import {UnionMessageEvent} from "../middleware.js";

export type FromTags = "private" | "group" | "discuss" | "any"

const fromMetadataKey = "bot:from";

export function from(type: FromTags) {
  return (target: object, propertyKey: string, descriptor: TypedPropertyDescriptor<(ctx: BotContext, e: UnionMessageEvent) => Promise<any>>) => {
    descriptor.value;
    Reflect.defineMetadata(fromMetadataKey, type, target, propertyKey);
  };
}

export function getFrom(target: any, propertyKey: string): FromTags | undefined {
  return Reflect.getMetadata(fromMetadataKey, target, propertyKey);
}
