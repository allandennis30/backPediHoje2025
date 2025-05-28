import { Express } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';
import { FilterXSS } from 'xss';

export function applySecurityMiddlewares(app: Express) {
    const xssFilter = new FilterXSS();

    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            styleSrc: ["'self'"],
            imgSrc: ["'self'"],
            fontSrc: ["'self'"],
            connectSrc: ["'self'"],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"],
            formAction: ["'self'"],
            upgradeInsecureRequests: [],
        }
    }));

    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 100,
            message: 'Muitas requisições, tente novamente mais tarde.',
            standardHeaders: true,
            legacyHeaders: false,
        })
    );

    const allowedOrigins = process.env.NODE_ENV === 'production'
        ? [process.env.FRONTEND_URL || '']
        : ['http://localhost:3000', '127.0.0.1'];

    app.use((req, res, next) => {
        if (req.path === '/') return next();

        const allowedOrigins = process.env.NODE_ENV === 'production'
            ? [process.env.FRONTEND_URL || '']
            : ['http://localhost:3000', '127.0.0.1'];

        cors({
            origin: function (origin, callback) {
                if (!origin) return callback(null, true);
                if (allowedOrigins.indexOf(origin) === -1) {
                    const msg = `Acesso CORS negado para origem: ${origin}`;
                    return callback(new Error(msg), false);
                }
                return callback(null, true);
            },
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            credentials: true,
        })(req, res, next);
    });

    app.use((req, res, next) => {
        if (req.body) mongoSanitize.sanitize(req.body);
        if (req.params) mongoSanitize.sanitize(req.params);

        const queryDescriptor = Object.getOwnPropertyDescriptor(req, 'query');

        if (!queryDescriptor || queryDescriptor.writable) {
            if (req.query) mongoSanitize.sanitize(req.query)
        }

        next();
    });

    app.use((req, res, next) => {
        const sanitizeObject = (obj: any) => {
            for (const key in obj) {
                if (typeof obj[key] === 'string') {
                    obj[key] = xssFilter.process(obj[key]);
                } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                    sanitizeObject(obj[key]);
                }
            }
        }

        if (req.body) sanitizeObject(req.body);
        if (req.params) sanitizeObject(req.params);

        const queryDescriptor = Object.getOwnPropertyDescriptor(req, 'query');

        if (!queryDescriptor || queryDescriptor.writable) {
            if (req.query) sanitizeObject(req.query);
        }

        next();
    });


    if (process.env.NODE_ENV !== 'production') {
        app.use(morgan('dev'));
    };

    app.set('trust proxy', 1);
}