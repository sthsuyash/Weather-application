import { User } from '@prisma/client';
import prisma from '../config/prisma';
import bcrypt from 'bcrypt';

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
    async registerUser(userData: any): Promise<void> {
        const {
            email,
            password,
            country,
            city,
            state,
            latitude,
            longitude
        } = userData;

        // Check if the email already exists in the database
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new Error('Username already exists. Choose a different username.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the user data to the database
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
        });
    }

    /**
     * Logs in a user with the provided credentials.
     *
     * @param {object} userData - User data including email and password.
     * @returns {Promise<User>} - A promise that resolves with the logged-in user's information.
     * @throws {Error} - Throws an error if the user is not found or if the password is incorrect.
     */
    async loginUser(userData: any): Promise<User> {
        const { email, password } = userData;

        // Retrieve the user from the database by email
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            throw new Error('User not found. Please check your credentials.');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw new Error('Incorrect password. Please check your credentials.');
        }

        return user;
    }
}

const userService = new UserService();
export default userService;
