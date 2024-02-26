import { Request, Response } from 'express'
import userService from '../services/userService'
import ApiResponse from '../../utils/response'

/**
 * Route for user registration.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 *
 * @throws {Error} - Throws an error if there is an error registering the user.
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
 * Route for user login.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 *
 * @throws {Error} - Throws an error if the user is not found.
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
 * Route for user logout.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 *
 * @throws {Error} - Throws an error if there is an error destroying the session.
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
 * Route for retrieving user profile.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 *
 * @throws {Error} - Throws an error if the user is not found.
 */
export const getUserProfile = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.session.userId as number
        const user = await userService.getUserById(userId)

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
 * Route for updating user profile.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 *
 * @throws {Error} - Throws an error if there is an error updating the user profile.
 */
export const updateUserProfile = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.session.userId as number
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
 * Route for updating user password.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 *
 * @throws {Error} - Throws an error if there is an error updating the user password.
 */
export const updateUserPassword = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.session.userId as number
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
 * Route for deleting user profile.
 *
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>}
 *
 * @throws {Error} - Throws an error if there is an error deleting the user profile.
 */
export const deleteUserProfile = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const userId = req.session.userId as number

        // clear the session and cookie
        req.session.destroy((error) => {
            if (error) {
                console.error('Error destroying session:', error)
                res.status(500).json(ApiResponse.error(error.message))
            } else {
                res.clearCookie('connect.sid')
            }
        })

        await userService.deleteUserById(userId)

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
