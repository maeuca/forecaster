import NodeCache from "node-cache";
import { config } from "../config";

export const cache = new NodeCache({
    stdTTL: config.cacheTTL,
    checkperiod: 120
});

export function getCacheKey(lat: number, lon: number) {
    return `weather:${lat}:${lon}`;
}