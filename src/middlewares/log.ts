import { NextFunction, Request, Response } from "express";
import ApiLog from "../models/ApiLog";

const routeLogger: Record<string, number> = {};

export const logRouteAccess = async (req: Request, res: Response, next: NextFunction) => {
    const path = req.path;

    try {
        await ApiLog.findOneAndUpdate(
            { path },
            { $inc: { count: 1 } },
            { upsert: true, new: true }
        );
    } catch (error) {
        console.error('Erro ao salvar log de rota:', error);
    }

    next();
};

export const getRouteLogs = () => routeLogger;
