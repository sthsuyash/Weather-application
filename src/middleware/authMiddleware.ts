import { Request, Response, NextFunction } from 'express'
import ApiResponse from '../../utils/response'

/**
 * Authentication middleware to check if the user is authenticated.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 */
export const authenticateUser = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    // Check if userId is present in the session
    if (req.session && req.session.userId) {
        // User is authenticated
        next()
    } else {
        res.status(401).json(ApiResponse.error('Unauthorized'))
    }
}
