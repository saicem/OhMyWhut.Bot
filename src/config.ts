interface configInterface {
  /**
   * 机器人账号
   */
  username: number,

  /**
   * 机器人密码
   */
  password: string,

  /**
   * 管理员账号,用于通知
   */
  admin: number,

  /**
   * 过滤长度，超过此长度的消息会被忽略
   */
  filterLength: number,

  /**
   * 通过 webapi 发送消息时需要的密钥
   */
  msgSecret: string,

  /**
   * 开学第一周周一，从环境变量读取时变量名为 termStartDate 格式为 2022-1-1，注意不要为 2022-01-01
   */
  termStartTimestamp: number


  /**
   * 对外暴露的链接地址
   */
  exposeApiUrl: string,

  /**
   * 依赖的 api 链接，查看 https://github.com/saicem/OhMyWhut.FastFetcher
   */
  fastFetcherUrl: string,

  /**
   * 用于截图的 api
   */
  webShotUrl: string;
}

let {
  username,
  password,
  admin,
  filterLength,
  fastFetcherUrl,
  msgSecret,
  termStartDate,
  exposeApiUrl,
  webShotUrl,
} = process.env;

export const config: configInterface = {
  username: Number(username),
  password: password!,
  admin: Number(admin),
  filterLength: Number(filterLength),
  fastFetcherUrl: fastFetcherUrl!,
  msgSecret: msgSecret!,
  termStartTimestamp: Date.parse(termStartDate!),
  exposeApiUrl: exposeApiUrl!,
  webShotUrl: webShotUrl!,
};

