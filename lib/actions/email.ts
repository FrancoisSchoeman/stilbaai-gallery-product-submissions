'use server';

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

interface ProductNotificationData {
  artistName: string;
  artistEmail: string;
  productTitle: string;
  sellingPrice: string;
  artistPayout: string;
  exhibitionName?: string;
}

export async function sendProductSubmissionEmail(
  data: ProductNotificationData,
) {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.error('ADMIN_EMAIL not configured');
    return { error: 'Email configuration error' };
  }

  try {
    await transporter.sendMail({
      from: `"Stilbaai Gallery" <${process.env.EMAIL_USERNAME}>`,
      to: [adminEmail, 'hello@stilbaaigalery.co.za'],
      subject: `New Artwork Submission: ${data.productTitle}`,
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #292524; border-bottom: 2px solid #d97706; padding-bottom: 10px;">
            New Artwork Submission
          </h1>
          
          <div style="background: #fafaf9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #44403c; margin-top: 0;">Artwork Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #78716c; width: 140px;">Title:</td>
                <td style="padding: 8px 0; color: #292524; font-weight: 500;">${
                  data.productTitle
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #78716c;">Selling Price:</td>
                <td style="padding: 8px 0; color: #292524; font-weight: 500;">R${
                  data.sellingPrice
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #78716c;">Artist Payout (55%):</td>
                <td style="padding: 8px 0; color: #292524; font-weight: 500;">R${
                  data.artistPayout
                }</td>
              </tr>
              ${
                data.exhibitionName
                  ? `
              <tr>
                <td style="padding: 8px 0; color: #78716c;">Exhibition:</td>
                <td style="padding: 8px 0; color: #292524; font-weight: 500;">${data.exhibitionName}</td>
              </tr>
              `
                  : ''
              }
            </table>
          </div>
          
          <div style="background: #fafaf9; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #44403c; margin-top: 0;">Artist Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #78716c; width: 140px;">Name:</td>
                <td style="padding: 8px 0; color: #292524; font-weight: 500;">${
                  data.artistName
                }</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #78716c;">Email:</td>
                <td style="padding: 8px 0; color: #292524; font-weight: 500;">${
                  data.artistEmail
                }</td>
              </tr>
            </table>
          </div>
          
          <p style="color: #78716c; font-size: 14px; margin-top: 30px;">
            The product has been added as a draft in WooCommerce. Please review and publish when ready.
          </p>
          
          <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 30px 0;" />
          
          <p style="color: #a8a29e; font-size: 12px; text-align: center;">
            Stilbaai Gallery Artist Submissions Portal
          </p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { error: 'Failed to send notification email' };
  }
}
