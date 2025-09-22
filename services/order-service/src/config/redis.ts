import Redis from 'ioredis';

const host = process.env.REDIS_HOST || '127.0.0.1';
const port = Number(process.env.REDIS_PORT || 6379);

const redis = new Redis({ host, port });

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (e) => console.error('Redis error', e));

export default redis;
