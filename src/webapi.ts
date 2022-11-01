import Koa from "koa";
import Router from "koa-router";
import {koaBody} from "koa-body";
import {config} from "./config.js";
import {Client} from "oicq";
import * as fs from "fs";
import {getDownloadTagCache} from "./cache.js";

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

  router.get("/cal/:id", async (ctx) => {
    const filename = getDownloadTagCache(ctx.params.id);
    if (filename == undefined) {
      ctx.response.body = "链接已失效";
      return;
    }
    ctx.response.body = fs.createReadStream(filename);
    ctx.response.set("content-disposition", "attachment; filename=courses.ics");
    ctx.response.set("content-type", "text/calendar");
  });

  app.use(router.routes());

  return app;
}
