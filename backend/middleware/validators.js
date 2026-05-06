const { body, validationResult } = require('express-validator');

/**
 * Global Validation Error Handler
 */
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            success: false,
            errors: errors.array().map(err => ({ field: err.path, message: err.msg }))
        });
    }
    next();
};

/**
 * Enquiry Form Validation Rules
 */
const validateEnquiry = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isString().withMessage('Name must be a string')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[6-9]\d{9}$/).withMessage('Please enter a valid 10-digit Indian mobile number'),
    
    body('business')
        .optional()
        .trim()
        .isString()
        .isLength({ max: 100 }).withMessage('Business name cannot exceed 100 characters'),
    
    body('city')
        .optional()
        .trim()
        .isString()
        .isLength({ max: 50 }).withMessage('City name cannot exceed 50 characters'),
    
    body('message')
        .optional()
        .trim()
        .isString()
        .isLength({ max: 500 }).withMessage('Message cannot exceed 500 characters')
];

/**
 * Admin Login Validation Rules
 */
const validateAdminLogin = [
    body('passphrase')
        .notEmpty().withMessage('Passphrase is required')
        .isString().withMessage('Passphrase must be a string')
        .isLength({ min: 6 }).withMessage('Passphrase is too short')
];

module.exports = {
    handleValidationErrors,
    validateEnquiry,
    validateAdminLogin
};
