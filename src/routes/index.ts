import express, { Router, Request, Response } from 'express'
const router: Router = express.Router()

import ApiResponse from '../../utils/response'
import userRoutes from './userRoutes'
import weatherRoutes from './weatherRoutes'
import { authenticateUser } from '../middleware/authMiddleware'

router.get('/', (req: Request, res: Response) => {
    res.status(200).json(
        ApiResponse.success<null>(null, 'Welcome to Weather API v1.0.')
    )
})

router.use('/user', userRoutes)
router.use('/weather', authenticateUser, weatherRoutes)

export default router
