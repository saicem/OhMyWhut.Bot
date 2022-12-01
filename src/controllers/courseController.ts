import {BotContext} from "../exoskeleton/context.js";
import {config} from "../config.js";
import {v4 as uuidv4} from "uuid";
import {segment} from "oicq";
import {fetcher} from "../request/fastFetcher.js";
import {db} from "../database/db.js";
import {BotControllerBase} from "../middlewares/controllerMapper.js";
import LRUCache from "lru-cache";
import {shareFileJar} from "../webapi.js";
import {help} from "./helpController.js";

const courseCacheIdJar = new LRUCache<number, string>({
  max: 128,
  ttl: 48 * 60 * 60 * 1000,
  ttlAutopurge: true,
  // updateAgeOnGet: true,
});

async function refreshCacheId(username: string, password: string, qq: number) {
  const res = await fetcher.fetchCourseJson(username, password);
  courseCacheIdJar.set(qq, res.cacheId);
  return res.cacheId;
}

export class CourseController implements BotControllerBase {
  command: string = "课表";

  @help("课表 [日历|1-20] [刷新]", "查询课表，可以以图片，ics 文件两种形式")
  async handle(ctx: BotContext, params: string[]): Promise<void> {
    const user = await db.getUser(ctx.request.user_id);
    if (user == null || user.username == null || user.password == null) {
      ctx.response.push("请先绑定学号");
      return;
    }

    if (params[0] == "刷新") {
      await refreshCacheId(user.username, user.password, ctx.request.sender.user_id);
      return;
    }

    let cacheId = courseCacheIdJar.get(ctx.request.sender.user_id);
    if (cacheId == undefined) {
      cacheId = await refreshCacheId(user.username, user.password, ctx.request.sender.user_id);
    }

    if (params[0] == "日历") {
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
    const buf = await fetcher.fetchCoursePng(cacheId, week);
    if (buf == undefined) {
      ctx.response.push("获取失败");
      return;
    }
    ctx.response.push(segment.image(buf));
  }
}
