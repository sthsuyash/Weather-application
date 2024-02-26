import dotenv from 'dotenv'
dotenv.config()

const config = {
    database: {
        port: process.env.DB_PORT,
        name: process.env.DB_NAME,
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        password: process.env.DB_PASSWORD
    },
    server: {
        port: process.env.SERVER_PORT
    },
    domain: {
        name: process.env.DOMAIN,
        apiUrl: process.env.DOMAIN + '/api/v1',
        clientUrl: process.env.CLIENT_URL
    },
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    },
    session: {
        secret: process.env.SESSION_SECRET || 'secret'
    },
    weather: {
        apiKey: process.env.WEATHER_API_KEY
    }
}

export default config
