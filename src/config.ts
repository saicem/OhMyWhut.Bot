export default {
  /**
   * 机器人账号
   */
  username: 0,

  /**
   * 机器人密码
   */
  password: "",

  /**
   * 管理员账号,用于通知
   */
  admin: 0,

  /**
   * 过滤长度，超过此长度的消息会被忽略
   */
  filterLength: 80,

  /**
   * 依赖的 api 链接，查看 https://github.com/saicem/OhMyWhut.FastFetcher
   */
  fastFetcherUrl: "",

  /**
   * 通过 webapi 发送消息时需要的密钥
   */
  msgSecret: "",

  /**
   * 开学第一周周一
   */
  termStartTimestamp: new Date(2022, 7, 29).getTime(),

  /**
   *
   */
  exposeApiUrl: "http://localhost:3000",
} as const;
