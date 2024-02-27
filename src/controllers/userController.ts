import { Request, Response } from 'express'
import userService from '../services/userService'
import ApiResponse from '../../utils/response'

/**
 * Registers a new user.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves once the user is registered.
 */
export const registerUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        await userService.registerUser(req.body)
        res.status(201).json(
            ApiResponse.success<null>(null, 'User registered successfully.')
        )
    } catch (error: any) {
        console.error('Error in /register route:', error)
        res.status(500).json(ApiResponse.error(error.message))
    }
}

/**
 * Logs in the user and creates a session with the user's ID
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves once the user is logged in.
 */
export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const user = await userService.loginUser(req.body)
        req.session.userId = user.id
        res.json(
            ApiResponse.success<null>(null, 'User logged in successfully.')
        )
    } catch (error: any) {
        console.error('Error in /login route:', error)
        res.status(500).json(ApiResponse.error(error.message))
    }
}

/**
 * Logs out the user and destroys the session.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves once the user is logged out.
 */
export const logoutUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        req.session.destroy((error) => {
            if (error) {
                console.error('Error destroying session:', error)
                res.status(500).json(ApiResponse.error(error.message))
            } else {
                res.clearCookie('connect.sid')
                res.json(
                    ApiResponse.success<null>(
                        null,
                        'User logged out successfully.'
                    )
                )
            }
        })
    } catch (error: any) {
        console.error('Error in /logout route:', error)
        res.status(500).json(ApiResponse.error(error.message))
    }
}

/**
 * Retrieves user profile based on session userId.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves with the user's profile information.
 */
export const getUserProfile = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.session.userId ?? 0
        const user = await userService.getUserProfile(userId)

        res.json(
            ApiResponse.success<any>(
                user,
                'User profile retrieved successfully.'
            )
        )
    } catch (error: any) {
        console.error('Error in /profile route:', error)
        res.status(500).json(ApiResponse.error(error.message))
    }
}

/**
 * Updates user profile based on session userId.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves once the user profile is updated.
 */
export const updateUserProfile = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.session.userId ?? 0
        await userService.updateUserProfile(userId, req.body)

        res.json(
            ApiResponse.success<null>(
                null,
                'User profile updated successfully.'
            )
        )
    } catch (error: any) {
        console.error('Error in /profile route:', error)
        res.status(500).json(ApiResponse.error(error.message))
    }
}

/**
 * Updates user password if authorized.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves once the user password is updated.
 */
export const updateUserPassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.session.userId ?? 0
        const { oldPassword, newPassword } = req.body
        await userService.updateUserPassword(userId, oldPassword, newPassword)

        res.json(
            ApiResponse.success<null>(
                null,
                'User password updated successfully.'
            )
        )
    } catch (error: any) {
        console.error('Error in /profile route:', error)
        res.status(500).json(ApiResponse.error(error.message))
    }
}

/**
 * Deletes user profile if authorized.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} - A promise that resolves once the user profile is deleted.
 */
export const deleteUserProfile = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.session.userId ?? 0

        // Destroy the session and clear the cookie
        await new Promise<void>((resolve, reject) => {
            req.session.destroy((error) => {
                if (error) {
                    console.error('Error destroying session:', error)
                    reject(error)
                } else {
                    // Check if headers have already been sent
                    if (!res.headersSent) {
                        res.clearCookie('connect.sid')
                    }
                    resolve()
                }
            })
        })

        // After destroying the session, delete the user profile
        await userService.deleteUserProfile(userId)

        res.json(
            ApiResponse.success<null>(
                null,
                'User profile deleted successfully.'
            )
        )
    } catch (error: any) {
        console.error('Error in /profile route:', error)
        res.status(500).json(ApiResponse.error(error.message))
    }
}
