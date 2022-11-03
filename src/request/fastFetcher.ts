import {config} from "../config.js";
import got from "got";

const baseUrl = config.fastFetcherUrl;

interface FetchBooksResponse {
  data: {
    books: {
      name: string,
      expire: string,
      borrow: string
    }[],
  };
}

interface FetchCardMoneyResponse {
  data: {
    cardMoney: string
  };
}

interface FetchElectricFeeResponse {
  data: {
    remainPower: string,
    totalPower: string,
    remainFee: string,
  };
}

interface FetchCourseJsonResponse {
  data: {
    courses: {
      name: string,
      room: string,
      teacher: string,
      startWeek: number,
      endWeek: number,
      startSection: number,
      /**
       * 0-6
       */
      endSection: number
    }[]
  };
  cacheId: string;
}

class FastFetcher {
  async fetchBooks(username: string, password: string) {
    const {data} = await got.post(`${baseUrl}/books`, {
      json: {
        username: username,
        password: password,
      },
    }).json() as FetchBooksResponse;
    return data.books;
  }


  async fetchCardMoney(username: string, password: string) {
    const {data} = await got.post(`${baseUrl}/card/money`, {
      json: {
        username: username,
        password: password,
      },
    }).json() as FetchCardMoneyResponse;
    return data.cardMoney;
  }


  async fetchElectricFee(username: string, password: string, meterId: string) {
    const {data} = await got.post(`${baseUrl}/electric`, {
      json: {
        username: username,
        password: password,
        meterId: meterId,
        factoryCode: "E035",
      },
    }).json() as FetchElectricFeeResponse;
    return data;
  }

  async fetchCourseJson(username: string, password: string) {
    return await got.post(`${baseUrl}/course/json`, {
      json: {
        username: username,
        password: password,
      },
    }).json() as FetchCourseJsonResponse;
  }

  async fetchCoursePng(cacheId: string, week: number = 0) {
    const resp = await got.get(`${baseUrl}/course/png/${cacheId}?week=${week}`);
    if (resp.headers["content-type"] == "image/png") {
      return resp.rawBody;
    }
  }

  async fetchCourseCal(cacheId: string) {
    const resp = await got.get(`${baseUrl}/course/cal/${cacheId}`);
    if (resp.headers["content-type"] == "text/calendar; charset=utf-8") {
      return resp.rawBody;
    }
  }

  /**
   * 依靠截图来获取课表图片
   * @param cacheId 缓存id
   * @param week 周次
   * @param template 模板
   */
  async fetchCoursePng2(cacheId: string, week: number, template: string = "basic") {
    const resp = await got.get(`${config.webshotUrl}/playwright?url=${`${baseUrl}/course/html?cache_id=${cacheId}`}`);
    if (resp.headers["content-type"] == "text/calendar; charset=utf-8") {
      return resp.rawBody;
    }
  }
}

export const fetcher = new FastFetcher();
