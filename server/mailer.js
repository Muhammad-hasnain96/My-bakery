import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const {
  SMTP_HOST,
  SMTP_PORT = 587,
  SMTP_SECURE = 'false',
  SMTP_USER,
  SMTP_PASS,
  SMTP_FROM,
} = process.env

export const isSmtpConfigured = Boolean(
  SMTP_HOST &&
  SMTP_USER &&
  SMTP_PASS &&
  !SMTP_USER.includes('your_email_here') &&
  !SMTP_PASS.includes('your_app_password_here')
)

let transporter = null

if (isSmtpConfigured) {
  // Clean spaces if Google App Password format (e.g., 'xxxx xxxx xxxx xxxx')
  const cleanPass = SMTP_PASS ? SMTP_PASS.trim().replace(/\s+/g, '') : ''
  const cleanUser = SMTP_USER ? SMTP_USER.trim() : ''

  transporter = nodemailer.createTransport({
    host: SMTP_HOST.trim(),
    port: parseInt(SMTP_PORT, 10),
    secure: SMTP_SECURE === 'true' || String(SMTP_PORT) === '465',
    auth: {
      user: cleanUser,
      pass: cleanPass,
    },
  })
}

/**
 * Verify SMTP connection
 */
export async function testSmtpConnection() {
  if (!isSmtpConfigured || !transporter) {
    return {
      connected: false,
      message: 'SMTP is not configured in .env. Running in console simulation mode.',
    }
  }

  try {
    await transporter.verify()
    return {
      connected: true,
      message: `Connected successfully to SMTP server (${SMTP_HOST}:${SMTP_PORT}) as ${SMTP_USER}`,
    }
  } catch (err) {
    return {
      connected: false,
      error: err.message,
      message: `SMTP connection failed: ${err.message}`,
    }
  }
}

/**
 * Send 6-Digit OTP Order Confirmation Email
 */
export async function sendOtpEmail({ to, customerName = 'Valued Customer', code, orderTotal }) {
  let fromAddress = SMTP_FROM || (SMTP_USER ? `"My Bakery 🥐" <${SMTP_USER}>` : '"My Bakery 🥐" <orders@bakery.pk>')
  if (SMTP_HOST && SMTP_HOST.includes('gmail') && SMTP_USER) {
    fromAddress = `"My Bakery 🥐" <${SMTP_USER.trim()}>`
  }
  const formattedTotal = orderTotal ? `Rs. ${Number(orderTotal).toLocaleString()}` : null

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Order Confirmation Code</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F5F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2D241E;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #F7F5F0; padding: 36px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card -->
        <table width="100%" max-width="540" cellpadding="0" cellspacing="0" border="0" style="max-width: 540px; background-color: #FFFFFF; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.06); border: 1px solid #ECE5DC;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #2B1D0C 0%, #1A1412 100%); padding: 32px 28px; text-align: center;">
              <div style="font-size: 32px; line-height: 1; margin-bottom: 6px;">🥐</div>
              <h1 style="color: #F8E7C9; font-size: 24px; font-weight: 700; margin: 0; letter-spacing: 0.5px;">MY BAKERY</h1>
              <p style="color: #D9A84E; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 2.5px; margin: 4px 0 0 0;">Artisanal Bakes & Confections</p>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 36px 32px;">
              <h2 style="font-size: 20px; font-weight: 700; color: #1E1711; margin: 0 0 12px 0;">Order Confirmation Code</h2>
              <p style="font-size: 15px; line-height: 1.6; color: #5C5248; margin: 0 0 24px 0;">
                Dear <strong>${customerName}</strong>,<br>
                Thank you for placing an order with <strong>My Bakery</strong>. To confirm and dispatch your freshly baked delicacies${formattedTotal ? ` (Total: <strong>${formattedTotal}</strong>)` : ''}, please enter the one-time verification code below:
              </p>

              <!-- OTP Code Display Box -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin: 28px 0;">
                <tr>
                  <td align="center" style="background-color: #FFFDF9; border: 2px dashed #E5A93C; border-radius: 14px; padding: 22px 16px;">
                    <div style="font-size: 12px; font-weight: 700; letter-spacing: 1.5px; color: #B45309; text-transform: uppercase; margin-bottom: 8px;">Your 6-Digit Verification PIN</div>
                    <div style="font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #7C2D12; font-family: 'Courier New', Courier, monospace; margin-left: 10px;">${code}</div>
                    <div style="font-size: 12px; color: #8C7E72; margin-top: 10px;">⏱️ Valid for <strong>5 minutes</strong> only</div>
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #FEF3C7; border-radius: 10px; padding: 14px 16px; margin-bottom: 24px;">
                <tr>
                  <td style="font-size: 12px; color: #92400E; line-height: 1.5;">
                    🔒 <strong>Security Warning:</strong> Never share this code with anyone. Our staff will never call or ask you for your confirmation code.
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; line-height: 1.6; color: #7A6F64; margin: 0;">
                If you did not initiate this order on our website or app, please disregard this email or contact customer support immediately.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #FAF8F5; border-top: 1px solid #ECE5DC; padding: 22px 28px; text-align: center;">
              <p style="font-size: 12px; color: #8A7E72; margin: 0 0 6px 0; font-weight: 600;">
                My Bakery Pakistan • Freshly Baked Daily
              </p>
              <p style="font-size: 11px; color: #ABA094; margin: 0;">
                Branches: Kohinoor Faisalabad • Gulberg Lahore • Clifton Karachi
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`

  const textFallback = `
MY BAKERY — ORDER CONFIRMATION CODE
===================================
Dear ${customerName},

Thank you for choosing My Bakery!
Your 6-digit confirmation code is: ${code}

Validity: 5 minutes
Order Total: ${formattedTotal || 'See your cart'}

Security Warning: Never share this OTP with anyone.
If you did not make this request, please ignore this email.

My Bakery Pakistan — Freshly Baked Daily
Branches: Kohinoor Faisalabad • Gulberg Lahore • Clifton Karachi
  `.trim()

  if (isSmtpConfigured && transporter) {
    try {
      const info = await transporter.sendMail({
        from: fromAddress,
        to,
        subject: `🔐 ${code} is your My Bakery Order Confirmation Code`,
        text: textFallback,
        html: htmlContent,
      })
      console.log(`✨ [LIVE SMTP EMAIL SENT] MessageID: ${info.messageId} to ${to}`)
      return {
        sent: true,
        mode: 'live_smtp',
        messageId: info.messageId,
        to,
      }
    } catch (sendErr) {
      console.error(`❌ [LIVE SMTP SEND ERROR]:`, sendErr.message)
      return {
        sent: false,
        mode: 'error',
        error: sendErr.message,
        to,
      }
    }
  }

  return {
    sent: false,
    mode: 'simulation',
    message: 'Live SMTP not configured in .env. Dispatched via console logger.',
    to,
  }
}

