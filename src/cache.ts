import LRUCache from "lru-cache";

export const shareFileJar = new LRUCache<string, Buffer>({
  max: 64,
  ttl: 300 * 1000,
  ttlAutopurge: true,
  noDeleteOnStaleGet: true,
});

export const cacheIdJar = new LRUCache<number, string>({
  max: 128,
  ttl: 60 * 60 * 48 * 1000,
  ttlAutopurge: true,
  updateAgeOnGet: true,
});

const botCache = new LRUCache({ttl: 80});

function getCacheHandler(): ProxyHandler<Function> {
  return {
    apply(target: Function, thisArg: any, argArray: any[]): any {
      const cacheKey = `target.name:${argArray.join("\n")}`;
      const cacheVal = botCache.get(cacheKey);
      if (cacheVal !== undefined) {
        return cacheVal;
      }
      const val = target(...argArray);
      botCache.set(cacheKey, val);
      return val;
    },
  };
}

export function cache(ttl: number = 80): MethodDecorator {
  return (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
    if (descriptor.hasOwnProperty("get") && descriptor.get) {
      descriptor.get = new Proxy(target[key as keyof typeof target], getCacheHandler()) as () => any;
    } else if (!descriptor.hasOwnProperty("set") && descriptor.value) {
      descriptor.value = new Proxy(target[key as keyof typeof target], getCacheHandler());
    } else {
      throw new Error("Can't set cache decorator on a setter");
    }
  };
}
