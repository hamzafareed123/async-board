export const otpEmailTemplate = (otp: string) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify Your Account</title>
  </head>

  <body style="margin:0;padding:0;background:#FAFAFA;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:40px 20px;">
          <table
            width="600"
            cellpadding="0"
            cellspacing="0"
            style="
              background:#FFFFFF;
              border-radius:12px;
              overflow:hidden;
              border:1px solid #E5E7EB;
            "
          >
            <!-- Header -->
            <tr>
              <td
                align="center"
                style="
                  background:#810B38;
                  padding:30px;
                "
              >
                <h1
                  style="
                    margin:0;
                    color:#FFFFFF;
                    font-size:28px;
                    font-weight:700;
                  "
                >
                  Async Board
                </h1>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:40px;">
                <h2
                  style="
                    margin-top:0;
                    color:#1F2937;
                    font-size:24px;
                  "
                >
                  Verify Your Account
                </h2>

                <p
                  style="
                    color:#6B7280;
                    font-size:16px;
                    line-height:1.7;
                  "
                >
                  Use the verification code below to complete your request.
                </p>

                <div
                  style="
                    text-align:center;
                    margin:30px 0;
                  "
                >
                  <div
                    style="
                      display:inline-block;
                      padding:16px 32px;
                      background:#F8F9FA;
                      border:2px dashed #810B38;
                      border-radius:10px;
                      font-size:32px;
                      font-weight:700;
                      letter-spacing:8px;
                      color:#810B38;
                    "
                  >
                    ${otp}
                  </div>
                </div>

                <p
                  style="
                    color:#6B7280;
                    font-size:15px;
                    line-height:1.7;
                  "
                >
                  This code will expire in <strong>10 minutes</strong>.
                </p>

                <p
                  style="
                    color:#6B7280;
                    font-size:15px;
                    line-height:1.7;
                  "
                >
                  If you didn't request this code, you can safely ignore this email.
                </p>

                <p
                  style="
                    margin-top:30px;
                    color:#1F2937;
                    font-weight:600;
                  "
                >
                  Async Board Team
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                align="center"
                style="
                  background:#F8F9FA;
                  padding:20px;
                  color:#6B7280;
                  font-size:14px;
                  border-top:1px solid #E5E7EB;
                "
              >
                © ${new Date().getFullYear()} Async Board. All rights reserved.
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