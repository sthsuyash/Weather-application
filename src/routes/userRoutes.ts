import express, { Router } from 'express';
const router: Router = express.Router();

import {
    registrationValidation,
    loginValidation
} from '../validation/userValidation';

import {
    registerUser,
    loginUser,
    logoutUser
} from '../controllers/userController';

router.post('/register', registrationValidation, registerUser);
router.post('/login', loginValidation, loginUser);
router.post('/logout', logoutUser);

export default router;
