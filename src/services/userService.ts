import { User } from '@prisma/client'
import prisma from '../config/prisma'
import bcrypt from 'bcrypt'

/**
 * Service class for handling user-related operations.
 */
class UserService {
    /**
     * Registers a new user with the provided user data.
     *
     * @param {object} userData - User data including email, password, country, city, state, latitude, and longitude.
     * @returns {Promise<void>} - A promise that resolves once the user is successfully registered.
     * @throws {Error} - Throws an error if the email already exists in the database.
     */
    static async registerUser(userData: any): Promise<void> {
        const { email, password, country, city, state, latitude, longitude } =
            userData

        // Check if the email already exists in the database
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            throw new Error('Email already exists. Choose a different email.')
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                country,
                state,
                city,
                latitude,
                longitude
            }
        })
    }

    /**
     * Logs in a user with the provided credentials.
     *
     * @param {object} userData - User data including email and password.
     * @returns {Promise<User>} - A promise that resolves with the logged-in user's information.
     * @throws {Error} - Throws an error if the user is not found.
     * @throws {Error} - Throws an error if the password is incorrect.
     */
    static async loginUser(userData: any): Promise<User> {
        const { email, password } = userData

        // Retrieve the user from the database by email
        const user = await prisma.user.findUnique({
            where: { email }
        })

        if (!user) {
            throw new Error('User not found. Please check your credentials.')
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            throw new Error(
                'Incorrect password. Please check your credentials.'
            )
        }

        return user
    }

    /**
     * Retrieves a user by their ID.
     *
     * @param {number} userId - The ID of the user to retrieve.
     * @returns {Promise<User | null>} - A promise that resolves with the user's information, or null if the user is not found.
     * @throws {Error} - Throws an error if the user is not found.
     */
    static async getUserProfile(userId: number): Promise<User | null> {
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            throw new Error('User not found.')
        }

        // delete the password from the user object before returning it
        delete (user as { password?: string }).password
        return user
    }

    /**
     * Updates all except the password of a user by their ID.
     *
     * @param {number} userId - The ID of the user to update.
     * @param {object} userData - The updated user data.
     * @returns {Promise<void>} - A promise that resolves once the user is successfully updated.
     * @throws {Error} - Throws an error if the user is not found.
     * @throws {Error} - Throws an error if the email already exists in the database.
     */
    static async updateUserProfile(
        userId: number,
        userData: any
    ): Promise<void> {
        // Check if the email already exists in the database
        if (userData.email) {
            const existingUser = await prisma.user.findUnique({
                where: { email: userData.email }
            })

            if (existingUser && existingUser.id !== userId) {
                throw new Error(
                    'Email already exists. Choose a different email.'
                )
            }
        }

        // Update the user data in the database
        const user = await prisma.user.update({
            where: { id: userId },
            data: userData
        })

        if (!user) {
            throw new Error('User not found.')
        }
    }

    /**
     * Updates the password of a user by their ID.
     *
     * @param {number} userId - The ID of the user to update.
     * @param {string} oldPassword - The old password.
     * @param {string} newPassword - The new password.
     * @returns {Promise<void>} - A promise that resolves once the password is successfully updated.
     * @throws {Error} - Throws an error if the user is not found.
     * @throws {Error} - Throws an error if the old password is incorrect.
     */
    static async updateUserPassword(
        userId: number,
        oldPassword: string,
        newPassword: string
    ): Promise<void> {
        // check if the old password matches the user's current password
        const user = await prisma.user.findUnique({
            where: { id: userId }
        })

        if (!user) {
            throw new Error('User not found.')
        }

        const passwordMatch = await bcrypt.compare(oldPassword, user.password)

        if (!passwordMatch) {
            throw new Error(
                'Incorrect old password. Please check your credentials.'
            )
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10)

        // Update the user's password in the database
        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        })
    }

    /**
     * Deletes a user by their ID in session.
     *
     * @param {number} userId - The ID of the user to delete.
     * @returns {Promise<void>} - A promise that resolves once the user is successfully deleted.
     * @throws {Error} - Throws an error if the user is not found.
     */
    static async deleteUserProfile(userId: number): Promise<void> {
        const user = await prisma.user.delete({
            where: { id: userId }
        })

        if (!user) {
            throw new Error('User not found.')
        }
    }
}

export default UserService
