import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    console.error(err.stack || err);

    const status = err.status || 500;
    const message =
        process.env.NODE_ENV === 'production'
            ? 'Internal Server Error'
            : err.message || 'Unknown error';

    res.status(status).json({
        status: 'error',
        message,
    });
}