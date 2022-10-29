import config from "../config.js";
import got from "got";

const baseUrl = config.fastFetcherUrl;

interface FetchBooksResponse {
  data: {
    name: string,
    expire: string,
    borrow: string,
  }[];
}

export async function fetchBooks(username: string, password: string) {
  const {data} = await got.post(`${baseUrl}/books`, {
    json: {
      username: username,
      password: password,
    },
  }).json() as FetchBooksResponse;
  return data;
}

interface FetchCardMoneyResponse {
  data: {
    cardMoney: string
  };
}

export async function fetchCardMoney(username: string, password: string) {
  const {data} = await got.post(`${baseUrl}/card/money`, {
    json: {
      username: username,
      password: password,
    },
  }).json() as FetchCardMoneyResponse;
  return data.cardMoney;
}

interface FetchElectricFeeResponse {
  data: {
    remainPower: string,
    remainFee: string,
  };
}

export async function fetchElectricFee(username: string, password: string, meterId: string) {
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

export async function fetchCoursePng(username: string, password: string, week: number = 0) {
  const response = await got.post(`${baseUrl}/course/png`, {
    json: {
      username: username,
      password: password,
      week: week,
    },
  });
  if (response.headers["content-type"] == "image/png") {
    // todo 存储图片
  }
}

export async function fetchCourseIcal(username: string, password: string) {
  const response = await got.post(`${baseUrl}/course/ical`, {
    json: {
      username: username,
      password: password,
    },
  });
  if (response.headers["content-type"] == "text/calendar; charset=utf-8") {
    // todo 存储 ical 文件
  }
}
