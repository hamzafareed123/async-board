import Joi from "joi";

export const signUpSchema = Joi.object({
  fullName: Joi.string().trim().required().messages({
    "string.empty": "Full Name is Required",
    "any.required": "Full Name is required",
  }),

  email: Joi.string().email().required().messages({
    "string.email": "Email Should be valid",
    "string.empty": "Email is Required",
    "any.required": "Email is required",
  }),

  password: Joi.string().min(4).max(15).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 4 characters",
    "string.max": "Password must be at most  15 characters",
    "any.required": "Password is required",
  }),
});

export const signInSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email Should be valid",
    "string.empty": "Email is Required",
    "any.required": "Email is required",
  }),

  password: Joi.string().messages({
    "string.empty": "Password is Required",
    "any.required": "Password is Required",
  }),
});

export const forgotPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Email Should be valid",
    "string.empty": "Email is Required",
    "any.required": "Email is required",
  }),
});

export const resetPasswordSchema = Joi.object({

  resetToken: Joi.string().required().messages({
    "string.empty": "Reset token is required",
    "any.required": "Reset token is required",
  }),

  password: Joi.string().min(4).max(15).required().messages({
    "string.empty": "Password is Required",
    "any.required": "Password is Required",
    "string.min": "Password must be at least 4 characters",
    "string.max": "Password must be at most  15 characters",
  }),
  confirmPassword: Joi.string().required().messages({
    "string.empty": "Confirm Password is Required",
    "any.required": "Confirm Password is Required",
  }),
});

export const verifyOtpSchema = Joi.object({
  userId: Joi.string().required().messages({
    "string.empty": "userId is required",
    "any.required": "userId is required",
  }),
  otp: Joi.string().length(6).required().messages({
    "string.empty": "OTP is required",
    "any.required": "OTP is required",
    "string.length": "OTP must be 6 digits",
  }),

});

export const updateProfileSchema = Joi.object({
  fullName: Joi.string().trim().optional().messages({
    "string.empty": "Full Name cannot be empty",
  }),

}).or("fullName", "avatar");