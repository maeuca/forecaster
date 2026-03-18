import { Request, Response, NextFunction } from "express";
import { config } from "../config";

type RateRecord = {
    count: number;
    start: number;
};

const requests = new Map<string, RateRecord>();

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip || req.socket.remoteAddress || "unknown";

    const now = Date.now();
    const windowMs = config.rateLimit.windowMs;
    const max = config.rateLimit.max;

    const record = requests.get(ip);

    if (!record) {
        requests.set(ip, { count: 1, start: now });
        return next();
    }

    if (now - record.start > windowMs) {
        requests.set(ip, { count: 1, start: now });
        return next();
    }

    if (record.count >= max) {
        return res.status(429).json({
            error: "Too many requests. Try again later."
        });
    }

    record.count++;
    next();
}