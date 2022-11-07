import {BotControllerBase} from "../exoskeleton/controller.js";
import {BotContext} from "../exoskeleton/context.js";
import {auth, UserInfo} from "../middlewares/authentication.js";
import {from} from "../exoskeleton/application.js";
import {config} from "../config.js";
import {v4 as uuidv4} from "uuid";
import {segment} from "oicq";
import {fetcher} from "../request/fastFetcher.js";
import {cacheIdJar, shareFileJar} from "../cache.js";

async function refreshCacheId(username: string, password: string, userId: number) {
  const res = await fetcher.fetchCourseJson(username, password);
  cacheIdJar.set(userId, res.cacheId);
  return res.cacheId;
}

async function getCacheId(ctx: BotContext) {
  const {username, password} = ctx.context.info.get("auth") as UserInfo;
  if (ctx.request.raw_message.match("刷新")) {
    return refreshCacheId(username, password, ctx.request.sender.user_id);
  }
  let cacheId = cacheIdJar.get(ctx.request.sender.user_id);
  if (cacheId == undefined) {
    return refreshCacheId(username, password, ctx.request.sender.user_id);
  }
  return cacheId;
}

export class CourseController implements BotControllerBase {
  match(msg: string): boolean {
    return msg.match(/^课表(?!\S)/) != null;
  }

  @auth("basic")
  @from("any")
  async handleAny(ctx: BotContext): Promise<void> {
    const cacheId = await getCacheId(ctx);
    if (ctx.request.raw_message.match(/日历/)) {
      await this.handleCal(ctx, cacheId);
    } else {
      const weekMatch = ctx.request.raw_message.match(/课表\s+(\d{1,2})/)?.[1];
      let week = Number(weekMatch);
      if (isNaN(week)) {
        week = Math.floor((new Date().getTime() - config.termStartTimestamp) / (1000 * 3600 * 24 * 7)) + 1;
      }
      await this.handlePng(ctx, cacheId, week);
    }
  }

  async handleCal(ctx: BotContext, cacheId: string) {
    const buf = await fetcher.fetchCourseCal(cacheId);
    if (buf == undefined) {
      ctx.response.push("获取失败");
      return;
    }
    const id = uuidv4();
    shareFileJar.set(id, buf);
    ctx.response.push(`下载后导入日历即可，5分钟内有效\n下载链接: ${config.exposeApiUrl}/cal/${id}`);
  }

  async handlePng(ctx: BotContext, cacheId: string, week: number) {
    const buf = await fetcher.fetchCoursePng2(cacheId, week);
    if (buf == undefined) {
      ctx.response.push("获取失败");
      return;
    }
    ctx.response.push(segment.image(buf));
  }
}
