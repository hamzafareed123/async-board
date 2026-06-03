export const sendWelcomeEmailTemplate = (
  email: string,
  userName: string
) => {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Welcome to Async Board</title>
  </head>

  <body style="margin:0;padding:0;background-color:#FAFAFA;font-family:Arial,sans-serif;">
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
              box-shadow:0 4px 12px rgba(0,0,0,0.08);
            "
          >
            <!-- Header -->
            <tr>
              <td
                align="center"
                style="
                  background:linear-gradient(135deg,#810B38,#6366F1);
                  padding:40px 20px;
                "
              >
                <h1
                  style="
                    margin:0;
                    color:#FFFFFF;
                    font-size:32px;
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
                    color:#111827;
                    margin-top:0;
                    font-size:24px;
                  "
                >
                  Welcome, ${userName}! 
                </h2>

                <p
                  style="
                    color:#4B5563;
                    font-size:16px;
                    line-height:1.7;
                  "
                >
                  Thanks for joining Async Board. We're excited to have you
                  onboard.
                </p>

                <p
                  style="
                    color:#4B5563;
                    font-size:16px;
                    line-height:1.7;
                  "
                >
                  Async Board helps teams collaborate visually, share ideas,
                  organize workflows, and stay aligned—whether working in real
                  time or asynchronously.
                </p>

                <div style="text-align:center;margin:40px 0;">
                  <a
                    href="https://your-domain.com/dashboard"
                    style="
                      background:#810B38;
                      color:#FFFFFF;
                      text-decoration:none;
                      padding:14px 28px;
                      border-radius:8px;
                      font-weight:600;
                      display:inline-block;
                    "
                  >
                    Open Async Board
                  </a>
                </div>

               
                <p
                  style="
                    margin-top:30px;
                    color:#4B5563;
                    font-size:16px;
                    line-height:1.7;
                  "
                >
                  If you have any questions, just reply to this email. Our team
                  is here to help.
                </p>

                <p style="color:#111827;font-weight:600;">
                  The Async Board Team
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                align="center"
                style="
                  background:#F8FAFC;
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