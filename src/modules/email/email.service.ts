import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendInquiryNotification(inquiry: any) {
    const mailOptions = {
      from: this.configService.get<string>('SMTP_USER'),
      to: this.configService.get<string>('SMTP_USER'),
      subject: `New Property Inquiry - ${inquiry.name}`,
      html: `
        <h2>New Property Inquiry</h2>
        <p><strong>Name:</strong> ${inquiry.name}</p>
        <p><strong>Email:</strong> ${inquiry.email}</p>
        <p><strong>Phone:</strong> ${inquiry.phone || 'Not provided'}</p>
        <p><strong>Message:</strong></p>
        <p>${inquiry.message}</p>
        ${inquiry.propertyId ? `<p><strong>Property ID:</strong> ${inquiry.propertyId}</p>` : ''}
        <p><strong>Date:</strong> ${new Date(inquiry.createdAt).toLocaleString()}</p>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }

  async sendInquiryConfirmation(inquiry: any) {
    const mailOptions = {
      from: this.configService.get<string>('SMTP_USER'),
      to: inquiry.email,
      subject: 'Thank you for your inquiry',
      html: `
        <h2>Thank you for your inquiry!</h2>
        <p>Dear ${inquiry.name},</p>
        <p>Thank you for your interest in our properties. We have received your inquiry and will get back to you as soon as possible.</p>
        <p>Your inquiry details:</p>
        <p><strong>Message:</strong> ${inquiry.message}</p>
        <p>Best regards,<br>Real Estate Team</p>
      `,
    };

    return this.transporter.sendMail(mailOptions);
  }
}