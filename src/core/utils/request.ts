import axios, { AxiosInstance } from 'axios';
import { isNotEmpty } from '../utils';

// tslint:disable-next-line: no-let
let httpRequest!: AxiosInstance;

const createAxioRequest = (baseUrl: string) => {
  if (isNotEmpty(httpRequest)) {
    return httpRequest;
  }
  // 创建axios实例
  const request = axios.create({
    baseURL: baseUrl, // api的base_url
    timeout: 200000 // 请求超时时间
  });

  // request拦截器
  request.interceptors.request.use(
    config => {
      return config;
    },
    error => {
      // Do something with request error
      Promise.reject(error);
    }
  );

  // timeout handler
  request.interceptors.response.use(
    undefined,
    async function axiosRetryInterceptor(err) {
      const config = err.config;
      // If config does not exist or the retry option is not set, reject
      if (!config || !config.retry) {
        return Promise.reject(err);
      }

      // Set the variable for keeping track of the retry count
      // tslint:disable-next-line: no-object-mutation
      config.__retryCount = config.__retryCount || 0;

      // Check if we've maxed out the total number of retries
      if (config.__retryCount >= config.retry) {
        // Reject with the error
        return Promise.reject(err);
      }

      // Increase the retry count
      // tslint:disable-next-line: no-object-mutation
      config.__retryCount += 1;

      // Create new promise to handle exponential backoff
      const backoff = new Promise(resolve => {
        setTimeout(() => {
          resolve();
        }, config.retryDelay || 1);
      });

      // Return the promise in which recalls axios to retry the request
      await backoff;
      return axios(config);
    }
  );

  // respone拦截器
  request.interceptors.response.use(
    res => {
      return res;
    },
    error => {
      return Promise.reject(error);
    }
  );

  httpRequest = request;
  return httpRequest;
};

export default createAxioRequest;
