import axios from "axios";

import { CallApiServiceOptions } from "../types";

export class ApiService {
  public readonly apiServiceUrl = process.env.API_SERVICE_URL;

  private stringifyData<V>(value: V): string | V {
    return Array.isArray(value) ? `["${value.join("\",\"")}"]` : value;
  }

  async call<Response, Data = unknown, Params = unknown>(options: CallApiServiceOptions<Params, Data>): Promise<Response> {
    const stringifiedParams = Object.entries(options.params || {})
      .reduce<Record<string, unknown>>((acc, [key, value]) => {
        acc[key] = this.stringifyData(value);
        return acc;
      }, {});

    const config: Record<string, unknown> = {
      url: options.path,
      method: options.method,
      baseURL: this.apiServiceUrl,
      params: stringifiedParams,
      data: options.data,
    };

    if (options.headers) {
      config.headers = {
        ...options.headers,
        "Content-Type": "application/json",
      };
    }

    const response = await axios.request(config);
    return response.data;
  }
}
