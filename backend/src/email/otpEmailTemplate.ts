export const otpEmailTemplate = (otp: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your OTP Code</title>
  </head>

  <body style="margin:0;padding:0;background:#F4F4F5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:48px 20px;">
          <table width="480" cellpadding="0" cellspacing="0" style="background:#FFFFFF;border-radius:16px;overflow:hidden;">

            <!-- Logo area -->
            <tr>
              <td style="padding:32px 40px 0;">
                <p style="margin:0;font-size:18px;font-weight:700;color:#6366F1;">
                  Async Board
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:32px 40px 40px;">

                <h1 style="margin:0 0 8px;font-size:24px;font-weight:700;color:#111827;">
                  Your verification code
                </h1>

                <p style="margin:0 0 32px;font-size:15px;color:#6B7280;line-height:1.6;">
                  Enter this code to verify your identity. It expires in 10 minutes.
                </p>

                <!-- OTP -->
                <div style="background:#F9FAFB;border-radius:12px;padding:28px;text-align:center;margin-bottom:32px;">
                  <p style="margin:0;font-size:40px;font-weight:800;letter-spacing:12px;color:#111827;">
                    ${otp}
                  </p>
                </div>

                <p style="margin:0 0 6px;font-size:13px;color:#9CA3AF;">
                  Didn't request this? You can safely ignore this email.
                </p>

                <p style="margin:0;font-size:13px;color:#9CA3AF;">
                  Never share this code with anyone.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:20px 40px;border-top:1px solid #F4F4F5;">
                <p style="margin:0;font-size:12px;color:#D1D5DB;">
                  © ${new Date().getFullYear()} Async Board
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
};