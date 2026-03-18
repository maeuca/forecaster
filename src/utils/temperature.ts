
export function classifyTemperature(temp: number): string {
    if (temp >= 80) return "hot";
    if (temp <= 50) return "cold";
    return "moderate";
}