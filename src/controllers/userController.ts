import { Request, Response } from 'express';
import userService from '../services/userService';
import ApiResponse from '../../utils/response';

/**
 * Route for user registration.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 */
export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        await userService.registerUser(req.body);
        res.
            status(201).
            json(ApiResponse.success<null>(null, 'User registered successfully.'));
    } catch (error: any) {
        console.error('Error in /register route:', error);
        res.
            status(500).
            json(ApiResponse.error('Error registering user.'));
    }
};

/**
 * Route for user login.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await userService.loginUser(req.body);
        req.session.userId = user.id;
        res.json(ApiResponse.success<null>(null, 'User logged in successfully.'));
    } catch (error: any) {
        console.error('Error in /login route:', error);
        res.
            status(401).
            json(ApiResponse.error('Authentication failed.'));
    }
};

/**
 * Route for user logout.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 */
export const logoutUser = async (req: Request, res: Response): Promise<void> => {
    try {
        req.session.destroy((error) => {
            if (error) {
                throw new Error('Error logging out user.');
            }
            res.json(ApiResponse.success<null>(null, 'User logged out successfully.'));
        });
    } catch (error: any) {
        console.error('Error in /logout route:', error);
        res.
            status(500).
            json(ApiResponse.error('Error logging out user.'));
    }
};
