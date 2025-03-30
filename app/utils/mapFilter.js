import { InternMap } from "d3";

export function filterInternMap(internMap, callback) {
    const filteredEntries = Array.from(internMap).filter(([key, value]) => callback(key, value));
    return new InternMap(filteredEntries);
  }