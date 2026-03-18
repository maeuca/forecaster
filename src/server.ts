// src/server.ts
import express, { Request, Response } from "express";
import { config } from "./config";
import { getForecast } from "./services/weatherService";
import { classifyTemperature } from "./utils/temperature";
import { validateQuery } from "./middleware/validate";
import { rateLimiter } from "./middleware/rateLimiter";
import { Forecast } from "./types/forecast";

const app = express();

app.use(rateLimiter);

app.get("/weather", validateQuery, async (req: Request, res: Response) => {
    try {
        const lat = Number(req.query.lat);
        const lon = Number(req.query.lon);

        const periods = await getForecast(lat, lon);
        const today = periods[0];

        const response: Forecast = {
            location: { lat, lon },
            forecast: today.shortForecast,
            temperature: today.temperature,
            unit: today.temperatureUnit,
            classification: classifyTemperature(today.temperature) as "hot" | "moderate" | "cold",
        };

        res.json(response);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to retrieve weather data" });
    }
});

app.listen(config.port, () => {
    console.log(`Server running at http://localhost:${config.port}`);
});