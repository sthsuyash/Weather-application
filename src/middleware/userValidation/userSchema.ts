import Joi, { ObjectSchema } from 'joi'

/**
 * @description Joi schema for validating user registration data.
 *
 * @type {ObjectSchema}
 */
export const registrationSchema: ObjectSchema = Joi.object({
    email: Joi.string().email().required().description('User email address.'),
    password: Joi.string()
        .min(8)
        .required()
        .description('User password (at least 8 characters).'),
    country: Joi.string().required().description('User country of residence.'),
    state: Joi.string()
        .required()
        .description('User state or region of residence.'),
    city: Joi.string().required().description('User city of residence.'),
    latitude: Joi.number().required().description('User latitude coordinates.'),
    longitude: Joi.number()
        .required()
        .description('User longitude coordinates.')
}).options({ abortEarly: true, convert: false })

/**
 * @description Joi schema for validating user login data.
 *
 * @type {ObjectSchema}
 */
export const loginSchema: ObjectSchema = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .description('User email address for login.'),
    password: Joi.string().required().description('User password for login.')
}).options({ abortEarly: true, convert: false })

/**
 * @description Joi schema for validating user profile update data.
 *
 * @type {ObjectSchema}
 */
export const editProfileSchema: ObjectSchema = Joi.object({
    email: Joi.string().email().description('User email address.'),
    country: Joi.string().description('User country of residence.'),
    state: Joi.string().description('User state or region of residence.'),
    city: Joi.string().description('User city of residence.'),
    latitude: Joi.number().description('User latitude coordinates.'),
    longitude: Joi.number().description('User longitude coordinates.')
})
    .options({ abortEarly: true, convert: false })
    .optional()

/**
 * @description Joi schema for validating user password update data.
 *
 * @type {ObjectSchema}
 */
export const updatePasswordSchema: ObjectSchema = Joi.object({
    oldPassword: Joi.string()
        .min(8)
        .required()
        .description('User old password (at least 8 characters).'),
    newPassword: Joi.string()
        .min(8)
        .required()
        .description('User new password (at least 8 characters).')
}).options({ abortEarly: true, convert: false })
