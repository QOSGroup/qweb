import createAxioRequest from "./utils/request";

class Qweb {
  public readonly config: {
    readonly chainId: string
    readonly baseUrl: string
  };

  constructor(config: {
    readonly chainId: string,
    readonly baseUrl: string
  }) {
    this.config = config
  }

  public get request() {
    return createAxioRequest(this.config.baseUrl)
  }
}


export default Qweb