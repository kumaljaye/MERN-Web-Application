import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { emailJSService, type EmailParams } from './EmailJSService';
import { InquiryFormData } from '@/schema';

export interface UseEmailJSOptions {
  successMessage?: string;
  errorMessage?: string;
  onSuccess?: () => void;
}

/**
 * Simple hook for EmailJS operations
 */
export const useEmailJS = (options: UseEmailJSOptions = {}) => {
  const {
    successMessage = 'Email sent successfully!',
    errorMessage = 'Failed to send email. Please try again.',
    onSuccess
  } = options;

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Send inquiry emails (admin + auto-reply)
   */
  const sendInquiryEmails = useCallback(
    async (data: InquiryFormData) => {
      setIsLoading(true);
      setError(null);

      try {
        await emailJSService.sendInquiryEmails(data);
        toast.success(successMessage);
        onSuccess?.();
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : errorMessage;
        setError(errorMsg);
        toast.error(errorMsg);
        console.error('Error sending inquiry:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [successMessage, errorMessage, onSuccess]
  );

  /**
   * Send a single email
   */
  const sendEmail = useCallback(
    async (templateId: string, templateParams: EmailParams) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await emailJSService.sendEmail(templateId, templateParams);
        toast.success(successMessage);
        onSuccess?.();
        return result;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : errorMessage;
        setError(errorMsg);
        toast.error(errorMsg);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [successMessage, errorMessage, onSuccess]
  );

  return {
    isLoading,
    error,
    sendInquiryEmails,
    sendEmail
  };
};

export default useEmailJS;
