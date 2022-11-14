import { get, isString } from "lodash-es";
import optionsSchema from "./options.schema.json" assert { type: "json" };

import type { IpEchoFunction } from "@cloudflare-ddns/ip-echo-parser";

interface Options {
  fields: string[];
}

export const parser: IpEchoFunction<Options> = async (echo, opts) => {
  const { fields } = opts;
  const data = JSON.parse(echo);
  const ip = get(data, fields);
  if (!isString(ip)) {
    throw new Error(`Expect ${fields.join(".")} to be string. Actual: ${ip}`);
  }
  return ip;
};
export const schema = optionsSchema;
