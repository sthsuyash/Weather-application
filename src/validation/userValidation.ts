import { Request, Response, NextFunction } from 'express';
import ApiResponse from '../../utils/response';
import { registrationSchema, loginSchema } from './userSchema';

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
        const validationResult = registrationSchema.validate(req.body);

        if (validationResult.error) {
            throw new Error('Invalid data for registration.');
        }

        next();
    } catch (error: any) {
        console.error('Error in registrationValidation middleware:', error);
        res.
            status(400).
            json(ApiResponse.error(error.message));
    }
};

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
        const validationResult = loginSchema.validate(req.body);

        if (validationResult.error) {
            throw new Error('Invalid data for user login.');
        }

        next();
    } catch (error: any) {
        console.error('Error in loginValidation middleware:', error);
        res.
            status(400).
            json(ApiResponse.error('Invalid data for login.'));
    }
};
