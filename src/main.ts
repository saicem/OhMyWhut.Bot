import "reflect-metadata";
import {createClient, Platform} from "oicq";
import {config} from "./config.js";
import {BotApplication} from "./exoskeleton/application.js";
import {HelpController} from "./controllers/helpController.js";
import {BindController} from "./controllers/bindController.js";
import {CourseController} from "./controllers/courseController.js";
import {BookController} from "./controllers/bookController.js";
import {CardMoneyController} from "./controllers/cardMoneyController.js";
import {ElectricController} from "./controllers/electricController.js";
import {createKoaApp} from "./webapi.js";
import {MessageFilter} from "./middlewares/messageFilter.js";
import {ControllerMapper} from "./middlewares/controllerMapper.js";

export const app = new BotApplication();
{
  app.addMiddleware(new MessageFilter());
  app.addMiddleware((() => {
    const mapper = new ControllerMapper();
    mapper.addController(new HelpController());
    mapper.addController(new BindController());
    mapper.addController(new BookController());
    mapper.addController(new CourseController());
    mapper.addController(new CardMoneyController());
    mapper.addController(new ElectricController());
    return mapper;
  })());
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

client.on("system.login.qrcode", function () {
  process.stdin.once("data", () => {
    this.login();
  });
}).login();


client.on("message", async (e) => {
  try {
    await app.handleTextMessage(e);
  } catch (e) {
    // todo 记录到错误日志
    console.log(e);
  }
});

const koaApp = createKoaApp(client);
koaApp.listen(3000);
