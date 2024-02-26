import { SessionOptions } from 'express-session';
import Redis from 'ioredis';
import config from '.';

const REDIS_PORT: number = parseInt(config.redis.port || '6379');

import RedisStore from 'connect-redis';
const redisClient = new Redis({
    host: config.redis.host,
    port: REDIS_PORT
});

redisClient.on('connect', () => {
    console.log('🚀 [redis]: Redis is connected.');
});

redisClient.on('error', (error) => {
    console.log('❌ [redis]: Error connecting to Redis:', error);
});

redisClient.on('end', () => {
    console.log('🚀 [redis]: Redis connection has been closed.');
});

export const sessionConfig: SessionOptions = {
    store: new RedisStore({ client: redisClient }),
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
    },
};
