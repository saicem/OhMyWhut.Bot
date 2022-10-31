import {BotControllerBase} from "../exoskeleton/controller.js";
import {BotContext} from "../exoskeleton/context.js";
import {auth, UserInfo} from "../middlewares/authentication.js";
import {from, UnionMessageEvent} from "../exoskeleton/application.js";
import config from "../config.js";
import {fetchCourseIcal, fetchCoursePng} from "../request/fastFetcher.js";
import {setDownloadTagCache} from "../cache.js";
import {v4 as uuidv4} from "uuid";
import {segment} from "oicq";

export class CourseController implements BotControllerBase {
  match(msg: string): boolean {
    return msg.startsWith("课表");
  }

  @auth("basic")
  @from("any")
  async handleAny(ctx: BotContext, e: UnionMessageEvent): Promise<void> {
    const param = e.raw_message.match(/课表\s+(.{1,5})/)?.[1];
    const {username, password} = ctx.info.get("auth") as UserInfo;
    if (e.raw_message.match(/日历/)) {
      await this.handleIcal(ctx, username, password);
    } else {
      let week = Number(param);
      if (isNaN(week)) {
        week = Math.floor((new Date().getTime() - config.termStartTimestamp) / (1000 * 3600 * 24 * 7)) + 1;
      }
      await this.handlePng(ctx, username, password, week);
    }
  }

  async handleIcal(ctx: BotContext, username: string, password: string) {
    const filename = await fetchCourseIcal(username, password);
    if (filename == undefined) {
      ctx.retMsg.push("获取失败");
      return;
    }
    const id = uuidv4();
    setDownloadTagCache(300, id, filename);
    ctx.retMsg.push(`下载后导入日历即可，5分钟内有效\n下载链接: ${config.exposeApiUrl}/cal/${id}`);
  }

  async handlePng(ctx: BotContext, username: string, password: string, week: number) {
    const filename = await fetchCoursePng(username, password, week);
    if (filename == undefined) {
      ctx.retMsg.push("获取失败");
      return;
    }
    ctx.retMsg.push(segment.image(filename));
  }
}
