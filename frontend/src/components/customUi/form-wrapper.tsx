'use client';

import FormDialog from './dialog-box';
import { Form } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { useForm, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { z } from 'zod';

interface FormWrapperProps {
  // Dialog props
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: string;
  label?: string;

  // Form configuration
  schema: z.ZodSchema<any>;
  defaultValues: Record<string, any>;

  // Form behavior
  onSubmit: (data: any) => void;
  submitButtonText?: string;

  // Optional initial data for editing
  initialData?: Record<string, any>;

  // Entity name for labels
  entityName?: string;

  // Form content
  children: (form: any) => React.ReactNode;
}

export function FormWrapper({
  open = false,
  onOpenChange,
  title,
  label,
  schema,
  defaultValues,
  onSubmit,
  submitButtonText,
  initialData,
  entityName = 'Item',
  children,
}: FormWrapperProps) {
  // Determine if we're in edit mode
  const isEditMode = !!initialData && Object.keys(initialData).length > 0;

  // Auto-generate titles and labels based on mode
  const finalTitle =
    title || (isEditMode ? `Edit ${entityName}` : `Add ${entityName}`);
  const finalLabel =
    label ||
    (isEditMode
      ? `Edit ${entityName.toLowerCase()} information`
      : `Add a new ${entityName.toLowerCase()}`);
  const finalSubmitButtonText =
    submitButtonText ||
    (isEditMode ? `Update ${entityName}` : `Add ${entityName}`);

  const form = useForm({
    resolver: zodResolver(schema as any),
    defaultValues: initialData
      ? { ...defaultValues, ...initialData }
      : defaultValues,
  });

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      form.reset({ ...defaultValues, ...initialData });
    } else {
      form.reset(defaultValues);
    }
  }, [initialData, form, defaultValues]);

  const handleSubmit = (data: FieldValues) => {
    console.log('Form submitted with data:', data);

    // Call the provided onSubmit function
    onSubmit(data);

    // Reset form
    form.reset();
    console.log('Form reset');

    // Close the main form dialog
    onOpenChange?.(false);
  };

  return (
    <FormDialog
      label={finalLabel}
      title={finalTitle}
      open={open}
      onOpenChange={onOpenChange}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
          {/* Scrollable Form Fields */}
          <div className="max-h-[60vh] overflow-y-auto space-y-8 pr-2">
            {children(form)}
          </div>
          
          {/* Fixed Submit Button */}
          <div className="border-t pt-4 mt-4">
            <Button type="submit" className="w-full">{finalSubmitButtonText}</Button>
          </div>
        </form>
      </Form>
    </FormDialog>
  );
}
