import express, { Express } from 'express'
import session, { SessionOptions } from 'express-session'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import bodyParser from 'body-parser'
import config from './config'
import routes from './routes'
import { sessionConfig } from './config/redisConfig'

const PORT: number | string = config.server.port || 3000
const API_URL: string = config.domain.apiUrl

// Add userId to session
declare module 'express-session' {
    interface SessionData {
        userId?: number
    }
}

const app: Express = express()

// Middleware
app.use(express.json())
app.use(morgan('tiny'))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(bodyParser.json())

// CORS Middleware
app.use(
    cors({
        allowedHeaders: ['Content-Type', 'Authorization'],
        origin: config.domain.clientUrl,
        credentials: true
    })
)

app.use(session(sessionConfig))

// Routes
app.use('/api/v1', routes)

// Start the server
app.listen(PORT, () => {
    console.log(`⚙️  [server]: Server is running at ${API_URL}`)
})
