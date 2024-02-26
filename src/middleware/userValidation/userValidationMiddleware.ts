import { Request, Response, NextFunction } from 'express'
import ApiResponse from '../../../utils/response'
import {
    registrationSchema,
    loginSchema,
    editProfileSchema,
    updatePasswordSchema
} from './userSchema'

/**
 * Middleware for validating user registration data.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 * @returns {void}
 */
export const registrationValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const validationResult = registrationSchema.validate(req.body)

        if (validationResult.error) {
            throw new Error('Invalid data for registration.')
        }

        next()
    } catch (error: any) {
        console.error('Error in registrationValidation middleware:', error)
        res.status(400).json(ApiResponse.error(error.message))
    }
}

/**
 * Middleware for validating user login data.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 * @returns {void}
 */
export const loginValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const validationResult = loginSchema.validate(req.body)

        if (validationResult.error) {
            throw new Error('Invalid data for user login.')
        }

        next()
    } catch (error: any) {
        console.error('Error in loginValidation middleware:', error)
        res.status(400).json(ApiResponse.error('Invalid data for login.'))
    }
}

/**
 * Middleware for validating user profile update data.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 * @returns {void}
 */
export const profileUpdateValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const validationResult = editProfileSchema.validate(req.body)

        if (validationResult.error) {
            throw new Error('Invalid data for profile update.')
        }

        next()
    } catch (error: any) {
        console.error('Error in profileUpdateValidation middleware:', error)
        res.status(400).json(ApiResponse.error(error.message))
    }
}

/**
 * Middleware for validating user password update data.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @param {NextFunction} next - Express next function.
 * @returns {void}
 */
export const passwordUpdateValidation = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const validationResult = updatePasswordSchema.validate(req.body)

        if (validationResult.error) {
            throw new Error('Invalid data for password update.')
        }

        next()
    } catch (error: any) {
        console.error('Error in passwordUpdateValidation middleware:', error)
        res.status(400).json(ApiResponse.error(error.message))
    }
}
