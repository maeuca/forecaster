import axios from "axios";
import { cache, getCacheKey } from "../utils/cache";

const BASE_URL = "https://api.weather.gov";

export async function getForecast(lat: number, lon: number) {
    const key = getCacheKey(lat, lon);

    const cached = cache.get(key);
    if (cached) return cached;

    try {
        // 2️⃣ Get grid info
        const pointsRes = await axios.get(`${BASE_URL}/points/${lat},${lon}`, {
            headers: { "User-Agent": "weather-app (your@email.com)" }
        });

        const forecastUrl = pointsRes.data.properties.forecast;

        const forecastRes = await axios.get(forecastUrl, {
            headers: { "User-Agent": "weather-app (your@email.com)" }
        });

        const periods = forecastRes.data.properties.periods;

        cache.set(key, periods);

        return periods;

    } catch (err) {
        console.error("Error fetching forecast:", err);
        throw new Error("Failed to fetch forecast from NWS API");
    }
}