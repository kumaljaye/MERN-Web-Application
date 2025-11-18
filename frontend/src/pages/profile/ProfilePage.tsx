import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Form } from '../../components/ui/form';
import { FormInput } from '../../components/customUi/form-input';
import { useAuthContext } from '../../contexts/AuthContext';
import { UserSchema, UserFormData } from '../../schema';
import { useProfileMutations } from '../../hooks/useProfile';

export default function ProfilePage() {
  const { user } = useAuthContext();
  const { updateProfile, isUpdating } = useProfileMutations();

  const form = useForm<UserFormData>({
    resolver: zodResolver(UserSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      mobileNumber: user?.mobileNumber || '',
      birthDate: user?.birthDate ? user.birthDate.split('T')[0] : '', // Convert to YYYY-MM-DD format
    }
  });

  const {
    handleSubmit,
    formState: { isValid, isDirty },
    control
  } = form;

  const onSubmit = async (data: UserFormData) => {
    try {
      await updateProfile.mutateAsync({
        firstName: data.firstName,
        lastName: data.lastName,
        mobileNumber: data.mobileNumber,
        birthDate: data.birthDate,
      });
    } catch (error) {
      // Error is handled in the mutation
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6">

          <h1 className="text-3xl font-bold text-foreground">Profile Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your personal information and account settings
          </p>
        </div>

        {/* Profile Card */}
        <Card className="p-6 space-y-6">
          {/* User Avatar Section */}
          <div className="flex items-center space-x-4 pb-6 border-b border-border">
            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {user.firstName} {user.lastName}
              </h2>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Profile Form */}
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>

              <FormInput
                control={control}
                name="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                disabled
              />

              <FormInput
                control={control}
                name="mobileNumber"
                label="Mobile Number"
                placeholder="Enter your mobile number"
              />

              <FormInput
                control={control}
                name="birthDate"
                label="Birth Date"
                type="date"
              />

              {/* Account Info Section */}
              <div className="pt-6 border-t border-border">
                <h3 className="text-lg font-semibold text-foreground mb-4">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-muted-foreground">User ID</label>
                    <p className="text-foreground font-medium">#{user.userId}</p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Account Status</label>
                    <p className={`font-medium ${user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Last Login</label>
                    <p className="text-foreground font-medium">
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleString()
                        : 'Never'
                      }
                    </p>
                  </div>
                  <div>
                    <label className="text-muted-foreground">Created</label>
                    <p className="text-foreground font-medium">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={!isDirty || isUpdating}
                >
                  Reset Changes
                </Button>
                <Button
                  type="submit"
                  disabled={!isValid || !isDirty || isUpdating}
                  className="min-w-[120px]"
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}