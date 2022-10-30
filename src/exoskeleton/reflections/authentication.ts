export type AuthenticationTags = "basic" | "electric"

const authenticationMetadataKey = "bot:authentication";

export function authentication(policy: AuthenticationTags): MethodDecorator {
  return (target, key, descriptor) => {
    Reflect.defineMetadata(authenticationMetadataKey, policy, target, key);
  };
}

export function getAuthentication(target: any, propertyKey: string): AuthenticationTags | undefined {
  return Reflect.getMetadata(authenticationMetadataKey, target, propertyKey);
}
