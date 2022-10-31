export interface BotContext {
  handlerName: string;
  controller: Object;
  info: Map<string, any>;
  retMsg: string[];
  stop: boolean;
}
