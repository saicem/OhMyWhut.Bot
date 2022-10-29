import "reflect-metadata";
import {createClient, Platform} from "oicq";
import config from "./config.js";
import {MessageDistributor} from "./exoskeleton/distributor.js";
import {HelpController} from "./controller/helpController.js";
import {BindController} from "./controller/bindController.js";
import {CourseController} from "./controller/courseController.js";
import {BotContext} from "./exoskeleton/botContext.js";

const distributor = new MessageDistributor();
{
  distributor.addController(new HelpController());
  distributor.addController(new BindController());
  distributor.addController(new CourseController());
}

const client = createClient(config.username, {platform: Platform.aPad});

client.on("system.online", () => {
  client.sendPrivateMsg(config.admin, "online");
  console.log("system.online");
});

// client.on("system.login.slider", function (e) {
//   console.log("输入ticket：")
//   process.stdin.once("data", ticket => this.submitSlider(String(ticket).trim()))
// }).login(password).then(r => console.log(r))

client.on("system.login.qrcode", function (e) {
  process.stdin.once("data", () => {
    this.login();
  });
}).login();


client.on("message", (e) => {
  // 过滤长消息
  if (e.raw_message.length > config.filterLength) return;

  // 找到消息匹配的控制器以及方法
  const controller = distributor.getController(e.raw_message);
  if (!controller) return;
  const methods = distributor.getMethods(controller);
  if (!methods) return;

  const ctx: BotContext = {
    e: e,
    info: new Map(),
  };

  // 遍历所有可用方法
  try {
    methods.any.forEach(key => (controller[key as keyof typeof controller] as any)(ctx));
    methods[e.message_type].forEach(key => (controller[key as keyof typeof controller] as any)(ctx));
  } catch (e) {
    // todo 记录到错误日志
    console.log(e);
  }
});

