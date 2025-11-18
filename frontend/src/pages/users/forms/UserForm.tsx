"use client";

import { UserSchema } from "@/schema";
import { z } from "zod";
import { User } from "../table-column/UserColumns";
import { useAddUser, useUpdateUser } from "@/hooks/useUserMutations";
import { FormWrapper } from "@/components/customUi/form-wrapper";
import { FormInput } from "@/components/customUi/form-input";
import { FormSelect } from "@/components/customUi/form-select";

interface UserFormProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  user?: User | null // If provided, form will be in edit mode
}

const UserForm = ({ open = false, onOpenChange, user }: UserFormProps) => {
  const addUserMutation = useAddUser();
  const updateUserMutation = useUpdateUser();

  // Define gender options
  const genderOptions = [
    
    { value: "Male", label: "Male" },
    { value: "Female", label: "Female" },
    { value: "Other", label: "Other" },
  ];

  // Default values for the form
  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    birthDate: "",
    gender: undefined,
  };

  // Handle form submission
  const handleSubmit = (data: z.infer<typeof UserSchema>) => {
    console.log("User form submitted:", data);
    
    if (user) {
      // Edit mode - use React Query mutation
      updateUserMutation.mutate({ id: user._id, userData: data });
      console.log("User updated:", data);
    } else {
      // Add mode - use React Query mutation
      addUserMutation.mutate(data);
      console.log("User added:", data);
    }

    // Close the form after submission
    onOpenChange?.(false);
  };

  // Prepare initial data for edit mode
  const initialData = user ? {
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    birthDate: user.birthDate,
    gender: user.gender,
  } : undefined;

  return (
    <FormWrapper
      open={open}
      onOpenChange={onOpenChange}
      entityName="User"
      schema={UserSchema}
      defaultValues={defaultValues}
      initialData={initialData}
      onSubmit={handleSubmit}
    >
      {(form) => (
        <>
          <FormInput
            control={form.control}
            name="firstName"
            label="First Name"
            type="text"
            placeholder="Enter first name"
          />
          
          <FormInput
            control={form.control}
            name="lastName"
            label="Last Name"
            type="text"
            placeholder="Enter last name"
          />
          
          <FormInput
            control={form.control}
            name="email"
            label="Email"
            type="email"
            placeholder="Enter email"
          />
          
          <FormInput
            control={form.control}
            name="birthDate"
            label="Birth Date"
            type="date"
            placeholder="Select birth date"
          />
          
          <FormSelect
            control={form.control}
            name="gender"
            label="Gender"
            options={genderOptions}
            placeholder="Select gender"
          />
        </>
      )}
    </FormWrapper>
  );
};

export default UserForm;