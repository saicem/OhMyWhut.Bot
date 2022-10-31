import Koa from "koa";
import Router from "koa-router";
import {koaBody} from "koa-body";
import config from "./config.js";
import {Client} from "oicq";

export function createKoaApp(client: Client) {
  const app = new Koa();
  const router = new Router();

  router.post("/msg", koaBody(), async (ctx) => {
    let {key, target, type, content} = ctx.request.body;
    if (key !== config.msgSecret) {
      ctx.response.status = 401;
      return;
    }

    target = Number(target);
    if (isNaN(target)) {
      ctx.response.status = 400;
      ctx.response.body = "target should be number";
      return;
    }

    if (content == undefined) {
      ctx.response.status = 400;
      ctx.response.body = "content can't be null";
    }

    switch (type) {
      case "private":
        await client.sendPrivateMsg(target, content);
        break;
      case "discuss":
        await client.sendDiscussMsg(target, content);
        break;
      case "group":
        await client.sendGroupMsg(target, content);
        break;
      default:
        ctx.response.status = 400;
        ctx.response.body = "type should be ono of 'private', 'discuss', 'group'";
        return;
    }
    console.log(key, target, type, content);
    ctx.body = JSON.stringify(ctx.request.body);
  });

  app.use(router.routes());

  return app;
}



