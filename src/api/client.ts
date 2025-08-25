import axios, {AxiosError, AxiosHeaders, AxiosResponse} from 'axios';
import Config from 'react-native-config';

// --------------- Axios instance ---------------
const client = axios.create({
  baseURL: Config.API_BASE_URL,
});

console.log("API_BASE_URL", Config.API_BASE_URL)
console.log("API_KEY", Config.API_KEY)

client.interceptors.request.use(
  config => {
    const token = Config.API_KEY;
    if (token) {
      const headers = new AxiosHeaders(config.headers);
      headers.set('x-api-key', `${token}`);
      config.headers = headers;
    }
    return config;
  },
  error => Promise.reject(error),
);

// --------------- RequestWrapper & helper ---------------
export type HandleOptions<T> = {
  onSuccess?: (data: T) => void;
  onError?: (error: AxiosError) => void;
  successMessage?: string;
  errorMessage?: string;
  onFinally?: () => void;
};

class RequestWrapper<T> {
  constructor(private promise: Promise<AxiosResponse<T>>) {}

  handle(opts: HandleOptions<T> = {}) {
    this.promise
      .then(res => {
        if (opts.successMessage) console.log(opts.successMessage);
        opts.onSuccess?.(res.data);
      })
      .catch((err: AxiosError) => {
        // HTTP error (server responded with 4xx/5xx)
        if (err.response) {
          if (opts.errorMessage) console.log(opts.errorMessage);
          opts.onError?.(err);
        } else {
          // Network / no-response error
          console.log('Network error:', err);
        }
      })
      .finally(() => {
        opts.onFinally?.();
      });
  }
}

/**
 * Wrap any Axios call so it gains a .handle() method.
 */
export function wrapRequest<T>(p: Promise<AxiosResponse<T>>) {
  return new RequestWrapper<T>(p);
}

export default client;
