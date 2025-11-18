import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Form } from '../../components/ui/form';
import { FormInput } from '../../components/customUi/form-input';
import { useLogin } from '../../hooks/useAuth';
import { useTheme } from '@/contexts/ThemeContext';
import { LoginSchema, LoginFormData } from '../../schema';
import type { LoginData } from '../../apis/auth';

export default function LoginPage() {
  const loginMutation = useLogin();
  const { theme, setTheme } = useTheme();

  // Force light theme for login page only, restore previous on unmount
  useEffect(() => {
    const prev = theme;
    setTheme('light');
    return () => setTheme(prev);
  }, []);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    mode: 'onBlur',
    defaultValues: {
      email: '',
      password: '',
    }
  });

  const {
    handleSubmit,
    formState: { isValid },
    control
  } = form;

  const onSubmit = async (data: LoginFormData) => {
    // The useLogin hook now handles success/error messages and navigation
    loginMutation.mutate(data as LoginData);
  };

  const isLoading = loginMutation.isPending;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="text-center">
          <LogIn className="mx-auto h-12 w-12 text-primary" />
          <h1 className="text-2xl font-bold text-gray-900 mt-4">Welcome Back</h1>
          <p className="text-sm text-gray-600 mt-2">
            Please sign in to your account to continue.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormInput
              control={control}
              name="email"
              label="Email Address"
              type="email"
              placeholder="Enter your email"
            />

            <FormInput
              control={control}
              name="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
            />

            <Button
              type="submit"
              className="w-full"
              disabled={!isValid || isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Form>

        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-medium text-primary hover:text-primary/80"
            >
              Create account
            </Link>
          </p>
          <Link
            to="/forgot-password"
            className="text-sm text-gray-600 hover:text-primary block"
          >
            Forgot your password?
          </Link>
        </div>
      </Card>
    </div>
  );
}