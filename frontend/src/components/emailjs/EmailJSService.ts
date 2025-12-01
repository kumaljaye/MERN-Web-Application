import emailjs from '@emailjs/browser';

export interface EmailParams {
  [key: string]: any;
}

/**
 * Simple EmailJS service for sending emails
 */
export class EmailJSService {
  private serviceId: string;
  private publicKey: string;

  constructor() {
    this.serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_3nhmcls';
    this.publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
  }

  /**
   * Send a single email using EmailJS
   */
  async sendEmail(templateId: string, templateParams: EmailParams) {
    if (!this.publicKey || !templateId) {
      throw new Error('EmailJS configuration is missing');
    }

    return await emailjs.send(
      this.serviceId,
      templateId,
      templateParams,
      this.publicKey
    );
  }

  /**
   * Send inquiry emails (admin + auto-reply)
   */
  async sendInquiryEmails(inquiryData: any) {
    const adminTemplateId = import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID;
    const autoReplyTemplateId = import.meta.env.VITE_EMAILJS_AUTO_REPLY_TEMPLATE_ID;

    if (!adminTemplateId || !autoReplyTemplateId) {
      throw new Error('Email templates are not configured');
    }

    // Admin notification parameters (matching template_admin_inquiry variables)
    const adminParams = {
      from_name: inquiryData.name,
      from_email: inquiryData.email,
      phone_number: inquiryData.phoneNumber, 
      subject: inquiryData.subject,
      message: inquiryData.message,
      reply_to: inquiryData.email,  
      to_email: 'kumal.j@botcalm.com',
      inquiry_date: new Date().toLocaleString(),
    };

    // Auto-reply parameters (matching template_auto_reply variables)
    const autoReplyParams = {
      to_name: inquiryData.name,  
      to_email: inquiryData.email,
      subject: inquiryData.subject,
      original_message: inquiryData.message,  
    };

    // Send both emails
    const adminResponse = await this.sendEmail(adminTemplateId, adminParams);
    const autoReplyResponse = await this.sendEmail(autoReplyTemplateId, autoReplyParams);

    return { adminResponse, autoReplyResponse };
  }
}

// Export singleton instance
export const emailJSService = new EmailJSService();
