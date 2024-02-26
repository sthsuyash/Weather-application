import express, { Router } from 'express'
const router: Router = express.Router()

import {
    registrationValidation,
    loginValidation,
    profileUpdateValidation,
    passwordUpdateValidation
} from '../middleware/userValidation/userValidationMiddleware'

import {
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    updateUserPassword,
    deleteUserProfile
} from '../controllers/userController'

import { authenticateUser } from '../middleware/authMiddleware'

router.post('/register', registrationValidation, registerUser)
router.post('/login', loginValidation, loginUser)
router.post('/logout', authenticateUser, logoutUser)
router.get('/profile', authenticateUser, getUserProfile)
router.patch(
    '/profile',
    profileUpdateValidation,
    authenticateUser,
    updateUserProfile
)
router.patch(
    '/password',
    passwordUpdateValidation,
    authenticateUser,
    updateUserPassword
)
router.delete('/profile', authenticateUser, deleteUserProfile)

export default router
