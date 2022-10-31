export interface BotControllerBase {
  match(msg: string): boolean;
}
