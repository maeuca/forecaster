
export type Forecast = {
    location: {
        lat: number;
        lon: number;
    };
    forecast: string;
    temperature: number;
    unit: string;
    classification: "hot" | "moderate" | "cold";
};