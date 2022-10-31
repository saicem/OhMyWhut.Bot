import "reflect-metadata";
import {createClient, Platform} from "oicq";
import config from "./config.js";
import {MessageDistributor} from "./exoskeleton/distributor.js";
import {HelpController} from "./controller/helpController.js";
import {BindController} from "./controller/bindController.js";
import {CourseController} from "./controller/courseController.js";
import {AuthenticationMiddleware} from "./exoskeleton/middleware.js";
import {BookController} from "./controller/bookController.js";
import {CardMoneyController} from "./controller/cardMoneyController.js";
import {ElectricController} from "./controller/electricController.js";

const distributor = new MessageDistributor();
{
  distributor.addMiddleware(new AuthenticationMiddleware());
  distributor.addController(new HelpController());
  distributor.addController(new BookController());
  distributor.addController(new BindController());
  distributor.addController(new CourseController());
  distributor.addController(new CardMoneyController());
  distributor.addController(new ElectricController());
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
    await distributor.handleTextMessage(e);
  } catch (e) {
    // todo 记录到错误日志
    console.log(e);
  }
});

