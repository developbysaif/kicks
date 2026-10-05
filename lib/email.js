import nodemailer from 'nodemailer';

/**
 * Returns dynamic app URL (production or development)
 */
export function getAppUrl() {
  const url = process.env.APP_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  return url.replace(/\/+$/, '');
}

/**
 * Sends a production-ready branded verification email using Resend, SMTP, or Dev fallback
 *
 * @param {object} params
 * @param {string} params.toEmail Recipient email address
 * @param {string} params.userName Recipient full name
 * @param {string} params.rawToken Raw cryptographically secure random verification token
 */
export async function sendVerificationEmail({ toEmail, userName, rawToken }) {
  const appUrl = getAppUrl();
  const verificationUrl = `${appUrl}/verify-email?token=${encodeURIComponent(rawToken)}`;
  const fromEmail = process.env.EMAIL_FROM || 'Kicks Home Care <noreply@kickhomecare.com>';
  const subject = 'Verify your email address';

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify your email address</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px 16px; color: #0f172a; }
        .wrapper { max-width: 540px; margin: 0 auto; background: #ffffff; border-radius: 24px; padding: 40px 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 20px rgba(0,0,0,0.04); }
        .logo-badge { width: 52px; height: 52px; background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: #ffffff; font-size: 26px; font-weight: 900; line-height: 52px; text-align: center; border-radius: 16px; margin: 0 auto 20px; box-shadow: 0 8px 16px rgba(220, 38, 38, 0.2); }
        .brand-title { font-size: 13px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; color: #dc2626; text-align: center; margin: 0 0 12px; }
        .title { color: #0f172a; font-size: 24px; font-weight: 900; text-align: center; margin: 0 0 12px; letter-spacing: -0.5px; }
        .message { color: #475569; font-size: 15px; line-height: 24px; text-align: center; margin: 0 0 32px; }
        .cta-container { text-align: center; margin: 32px 0; }
        .btn-verify { display: inline-block; background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); color: #ffffff !important; font-size: 15px; font-weight: 700; text-decoration: none; padding: 14px 36px; border-radius: 14px; box-shadow: 0 6px 16px rgba(220, 38, 38, 0.3); }
        .notice-box { background: #fef2f2; border: 1px solid #fee2e2; border-radius: 14px; padding: 14px 18px; margin: 24px 0; text-align: center; }
        .notice-text { color: #991b1b; font-size: 13px; font-weight: 600; margin: 0; }
        .fallback-section { border-top: 1px solid #f1f5f9; padding-top: 20px; margin-top: 28px; word-break: break-all; }
        .fallback-label { font-size: 12px; font-weight: 600; color: #64748b; margin: 0 0 6px; }
        .fallback-link { font-size: 12px; color: #dc2626; text-decoration: underline; }
        .security-note { font-size: 12px; color: #94a3b8; text-align: center; margin: 24px 0 0; line-height: 18px; }
        .footer { font-size: 11px; color: #94a3b8; text-align: center; margin-top: 28px; border-top: 1px solid #f1f5f9; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="logo-badge">K</div>
        <p class="brand-title">KICKS HOME CARE</p>
        <h1 class="title">Verify your email address</h1>
        <p class="message">
          Hello <strong>${userName || 'there'}</strong>,<br>
          Welcome to Kicks! Please verify your email address to activate your account and start shopping.
        </p>

        <div class="cta-container">
          <a href="${verificationUrl}" class="btn-verify" target="_blank" rel="noopener noreferrer">
            Verify Email
          </a>
        </div>

        <div class="notice-box">
          <p class="notice-text">⏱ This verification link will expire in 30 minutes.</p>
        </div>

        <div class="fallback-section">
          <p class="fallback-label">If the button above doesn't work, copy and paste this URL into your web browser:</p>
          <a href="${verificationUrl}" class="fallback-link">${verificationUrl}</a>
        </div>

        <p class="security-note">
          If you did not create this account, you can safely ignore this email.
        </p>

        <div class="footer">
          &copy; ${new Date().getFullYear()} Kicks Home Care. Pakistan's trusted shoe, home & laundry cleaning brand.
        </div>
      </div>
    </body>
    </html>
  `;

  // 1. Resend API Provider
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          subject,
          html: htmlContent
        })
      });

      if (res.ok) {
        console.log(`[EMAIL RESEND] Verification email sent to ${toEmail}`);
        return { success: true, provider: 'resend', verificationUrl };
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.warn('[EMAIL RESEND ERROR]', errorData);
      }
    } catch (resendErr) {
      console.warn('[EMAIL RESEND EXCEPTION]', resendErr.message);
    }
  }

  // 2. SMTP Provider via Nodemailer
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpPort = Number(process.env.SMTP_PORT) || 587;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: { user: smtpUser, pass: smtpPass }
      });

      await transporter.sendMail({
        from: fromEmail,
        to: toEmail,
        subject,
        text: `Welcome! Please verify your email by visiting: ${verificationUrl} (Expires in 30 minutes). If you did not create this account, ignore this email.`,
        html: htmlContent
      });

      console.log(`[EMAIL SMTP] Verification email sent to ${toEmail}`);
      return { success: true, provider: 'smtp', verificationUrl };
    } catch (smtpErr) {
      console.error('[EMAIL SMTP ERROR]', smtpErr.message);
    }
  }

  // 3. Local Development Simulation Fallback
  console.log(`\n======================================================`);
  console.log(`[EMAIL VERIFICATION (DEV / SIMULATION MODE)]`);
  console.log(`To: ${toEmail}`);
  console.log(`Verification URL: ${verificationUrl}`);
  console.log(`Expires in: 30 minutes`);
  console.log(`======================================================\n`);

  return { success: true, provider: 'simulation', simulated: true, verificationUrl };
}
