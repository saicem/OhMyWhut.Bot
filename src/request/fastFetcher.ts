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

  async fetchCourseCal(cacheId: string) {
    const resp = await got.get(`${baseUrl}/course/cal/${cacheId}`);
    if (resp.headers["content-type"] == "text/calendar; charset=utf-8") {
      return resp.rawBody;
    }
  }

  /**
   * ?????????????????????????????????
   * @param cacheId ??????id
   * @param week ??????
   * @param template ??????
   * @param width ????????????
   * @param height ????????????
   */
  async fetchCoursePng(cacheId: string, week: number, template: string = "basic", width: number = 980, height: number = 2119) {
    const resp = await got.get({
      url: `${config.webShotUrl}/playwright`,
      searchParams: {
        url: `${baseUrl}/course/html/${cacheId}?week=${week}`,
        width: width,
        height: height,
      },
    });
    if (resp.headers["content-type"] == "image/png") {
      return resp.rawBody;
    }
  }
}

export const fetcher = new FastFetcher();
