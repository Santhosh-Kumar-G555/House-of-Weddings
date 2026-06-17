import nodemailer from 'nodemailer';

// Configure the SMTP transport for Vercel compatibility
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL for Port 465
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendPasswordResetEmail = async (to: string, otp: string) => {
  const mailOptions = {
    from: `"House of Weddings" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: 'Your Password Reset Code',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <h2 style="color: #1e293b; text-align: center;">Reset Your Password</h2>
        <p style="color: #475569; font-size: 16px;">We received a request to reset your password. Here is your 6-digit verification code:</p>
        <div style="background-color: #f1f5f9; padding: 15px; text-align: center; border-radius: 8px; margin: 20px 0;">
          <h1 style="color: #0f172a; margin: 0; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p style="color: #475569; font-size: 14px;">This code will expire in <strong>15 minutes</strong>. If you did not request this reset, please ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { success: false, error };
  }
};
