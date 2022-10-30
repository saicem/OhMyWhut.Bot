export function from(type: "private" | "group" | "discuss" | "any"): MethodDecorator {
  return (target, key, descriptor) => {
    Reflect.defineMetadata("bot:from", type, target, key);
  };
}

export function getFrom(target: any, propertyKey: string): "private" | "group" | "discuss" | "any" | undefined {
  return Reflect.getMetadata("bot:from", target, propertyKey);
}

export function authentication(policy: "basic"): MethodDecorator {
  return (target, key, descriptor) => {
    Reflect.defineMetadata("bot:authentication", policy, target, key);
  };
}

export function getAuthentication(target: any, propertyKey: string): "basic" | undefined {
  return Reflect.getMetadata("bot:authentication", target, propertyKey);
}
