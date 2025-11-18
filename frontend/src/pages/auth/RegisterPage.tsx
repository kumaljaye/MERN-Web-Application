import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Form } from '../../components/ui/form';
import { FormInput } from '../../components/customUi/form-input';
import { useRegister } from '../../hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { RegisterSchema, RegisterFormData } from '../../schema';
import type { RegisterData } from '../../apis/auth';

export default function RegisterPage() {
  const registerMutation = useRegister();
  const { theme, setTheme } = useTheme();

  // Force light theme for register page only, restore previous on unmount
  useEffect(() => {
    const prev = theme;
    setTheme('light');
    return () => setTheme(prev);
  }, []);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      birthDate: '',
      mobileNumber: '',
    }
  });

  const {
    handleSubmit,
    formState: { isValid },
    control
  } = form;

  const onSubmit = async (data: RegisterFormData) => {
    // The useRegister hook now handles success/error messages and navigation
    registerMutation.mutate(data as RegisterData);
  };

  const isLoading = registerMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <UserPlus className="mx-auto h-12 w-12 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Create Account</h1>
          <p className="text-sm text-gray-600 mt-2">
            Join us today! Please fill in your information.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              control={control}
              name="firstName"
              label="First Name"
              placeholder="Enter your first name"
            />

            <FormInput
              control={control}
              name="lastName"
              label="Last Name"
              placeholder="Enter your last name"
            />

            <FormInput
              control={control}
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter your email"
            />

            <FormInput
              control={control}
              name="birthDate"
              label="Birth Date"
              type="date"
            />

            <FormInput
              control={control}
              name="mobileNumber"
              label="Mobile Number"
              placeholder="Enter your mobile number"
            />

            <FormInput
              control={control}
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
            />

            <FormInput
              control={control}
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Confirm your password"
            />

            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </Form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              to="/"
              className="font-medium text-primary hover:text-primary/80"
            >
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}