import {config} from "../config.js";
import got from "got";
import {fileHandler} from "../fileHandler.js";

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

  async fetchCoursePng(username: string, password: string, week: number = 0) {
    const filename = `${username}-${week}.png`;
    if (await fileHandler.hasFile(filename)) {
      return filename;
    }
    const response = await got.post(`${baseUrl}/course/png`, {
      json: {
        username: username,
        password: password,
        week: week,
      },
    });
    if (response.headers["content-type"] == "image/png") {
      await fileHandler.writeFile(filename, response.rawBody);
      return filename;
    }
  }

  async fetchCourseIcal(username: string, password: string) {
    const filename = `${username}.ics`;
    if (await fileHandler.hasFile(filename)) {
      return filename;
    }
    const response = await got.post(`${baseUrl}/course/ical`, {
      json: {
        username: username,
        password: password,
      },
    });
    if (response.headers["content-type"] == "text/calendar; charset=utf-8") {
      await fileHandler.writeFile(filename, response.rawBody);
      return filename;
    }
  }

  async fetchCourseJson(username: string, password: string) {
    const {data} = await got.post(`${baseUrl}/course/json`, {
      json: {
        username: username,
        password: password,
      },
    }).json() as FetchCourseJsonResponse;
    return data.courses;
  }
}

export const fetcher = new FastFetcher();
