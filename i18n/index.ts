import rawMessages from "./messages";

import { langs } from "~/utils/constants";

type RawMessages = {
  [key: string]: {
    [lang: string]: string;
  };
};

const raw = rawMessages as RawMessages;

function generateMessages(data: RawMessages) {
  const result: Record<string, Record<string, string>> = {};

  for (const locale of langs) {
    result[locale] = {};
    for (const key in data) {
      if (locale === "vi") {
        result[locale][key] = key;
      } else {
        result[locale][key] = data[key]?.[locale] || key;
      }
    }
  }

  return result;
}

export default {
  legacy: false,
  locale: "lo",
  fallbackLocale: "vi",
  messages: generateMessages(raw),
};
