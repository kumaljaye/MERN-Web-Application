import * as z from 'zod';


export const UserSchema = z.object({
  firstName: z.string()
    .min(1, { message: "First name must be at least 1 character" })
    .max(50, { message: "First name cannot exceed 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "First name can only contain letters and spaces" }),

  lastName: z.string()
    .min(1, { message: "Last name must be at least 1 character" })
    .max(50, { message: "Last name cannot exceed 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Last name can only contain letters and spaces" }),

  email: z.string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),

  mobileNumber: z.string()
    .min(10, { message: "Mobile number must be at least 10 digits" })
    .regex(/^\d+$/, { message: "Mobile number can only contain digits" })
    .optional(),

  birthDate: z.string()
    .min(1, { message: "Birth date is required" }),

  gender: z.enum(["Male", "Female", "Other"], {
    message: "Please select a valid gender"
  }).optional()
});

// Authentication Schemas
export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});


export const RegisterSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(6, 'Password must be at least 6 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  confirmPassword: z.string(),
  birthDate: z.string().min(1, 'Birth date is required'),
  mobileNumber: z.string()
    .min(10, 'Mobile number must be at least 10 digits')
    .regex(/^\d+$/, 'Mobile number can only contain digits'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Type exports
export type UserFormData = z.infer<typeof UserSchema>;
export type LoginFormData = z.infer<typeof LoginSchema>;
export type RegisterFormData = z.infer<typeof RegisterSchema>;
