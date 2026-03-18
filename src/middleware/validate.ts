import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const schema = z.object({
    lat: z.string().transform(Number).refine(v => v >= -90 && v <= 90),
    lon: z.string().transform(Number).refine(v => v >= -180 && v <= 180)
});

export function validateQuery(req: Request, res: Response, next: NextFunction) {
    try {
        const parsed = schema.parse(req.query);

        req.query.lat = parsed.lat.toString();
        req.query.lon = parsed.lon.toString();

        next();
    } catch {
        res.status(400).json({ error: "Invalid latitude or longitude" });
    }
}