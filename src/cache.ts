import NodeCache from "node-cache";

const botCache = new NodeCache({stdTTL: 80, checkperiod: 120});

function getCacheHandler(ttl: number): ProxyHandler<Function> {
  return {
    apply(target: Function, thisArg: any, argArray: any[]): any {
      const cacheKey = `target.name:${argArray.join("\n")}`;
      const cacheVal = botCache.get(cacheKey);
      if (cacheVal !== undefined) {
        return cacheVal;
      }
      const val = target(...argArray);
      botCache.set(cacheKey, val, ttl);
      return val;
    },
  };
}

export function cache(ttl: number = 80): MethodDecorator {
  return (target: object, key: string | symbol, descriptor: PropertyDescriptor) => {
    if (descriptor.hasOwnProperty("get") && descriptor.get) {
      descriptor.get = new Proxy(target[key as keyof typeof target], getCacheHandler(ttl)) as () => any;
    } else if (!descriptor.hasOwnProperty("set") && descriptor.value) {
      descriptor.value = new Proxy(target[key as keyof typeof target], getCacheHandler(ttl));
    } else {
      throw new Error("Can't set cache decorator on a setter");
    }
  };
}

export function setDownloadTagCache(ttl: number, downloadTag: string, filename: string) {
  botCache.set(downloadTag, filename, ttl);
}

export function getDownloadTagCache(downloadTag: string) {
  return botCache.get<string>(downloadTag);
}
