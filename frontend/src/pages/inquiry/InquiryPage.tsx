'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormInput } from '@/components/customUi/form-input';
import { FormTextarea } from '@/components/customUi/form-textarea';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { InquirySchema, type InquiryFormData } from '@/schema';
import { useEmailJS } from '@/components/emailjs';


const InquiryPage: React.FC = () => {
  // Initialize the EmailJS hook with custom options
  const { 
    sendInquiryEmails, 
    isLoading
  } = useEmailJS({
    successMessage: 'Your inquiry has been sent successfully! We will get back to you soon. Please check your email for confirmation.',
    errorMessage: 'Failed to send inquiry. Please try again or contact us directly.',
    onSuccess: () => {
      form.reset();
    }
  });

  const form = useForm<InquiryFormData>({
    resolver: zodResolver(InquirySchema),
    defaultValues: {
      name: '',
      email: '',
      phoneNumber: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (data: InquiryFormData) => {
    // Send both admin notification and auto-reply emails
    // Error handling is managed by the hook
    await sendInquiryEmails(data);
  };

  return (
    <div className="container mx-auto  px-4">
      <div className=" mx-auto">
        {/* Header */}
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-gray-600 text-lg">
            Have a question or need assistance? We're here to help!
          </p>
        </div>

        <div className="grid md:grid-cols-1 gap-8">
  

          {/* Inquiry Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24 hours.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormInput
                    control={form.control}
                    name="name"
                    label="Full Name"
                    placeholder="Enter your full name"
                    required
                  />

                  <FormInput
                    control={form.control}
                    name="email"
                    label="Email Address"
                    type="email"
                    placeholder="Enter your email address"
                    required
                  />

                  <FormInput
                    control={form.control}
                    name="phoneNumber"
                    label="Phone Number"
                    placeholder="Enter your phone number"
                    required
                  />

                  <FormInput
                    control={form.control}
                    name="subject"
                    label="Subject"
                    placeholder="What is your inquiry about?"
                    required
                  />

                  <FormTextarea
                    control={form.control}
                    name="message"
                    label="Message"
                    placeholder="Please describe your inquiry in detail..."
                    rows={5}
                    required
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InquiryPage;