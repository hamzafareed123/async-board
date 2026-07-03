import { ENV } from "../config/env"
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
              border:1px solid #E5E7EB;
            "
          >
            <!-- Header -->
            <tr>
              <td
                align="center"
                style="background:#6366F1;padding:36px 20px;"
              >
                <h1 style="margin:0;color:#FFFFFF;font-size:26px;font-weight:700;letter-spacing:-0.5px;">
                  Async Board
                </h1>
                <p style="margin:6px 0 0;color:#EEF2FF;font-size:13px;">
                  Real-time collaborative whiteboard
                </p>
              </td>
            </tr>

            <!-- Welcome banner -->
            <tr>
              <td style="background:#EEF2FF;padding:20px 40px;border-bottom:1px solid #E5E7EB;">
                <p style="margin:0;color:#4F46E5;font-size:15px;font-weight:600;text-align:center;">
                   Your account has been created successfully
                </p>
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:40px;">
                <h2 style="color:#111827;margin-top:0;font-size:22px;font-weight:600;">
                  Welcome, ${userName}!
                </h2>

                <p style="color:#6B7280;font-size:15px;line-height:1.7;margin-bottom:16px;">
                  Thanks for joining Async Board. We're excited to have you onboard.
                </p>

                <p style="color:#6B7280;font-size:15px;line-height:1.7;margin-bottom:28px;">
                  Async Board helps teams collaborate visually, share ideas,
                  organize workflows, and stay aligned — whether working in real
                  time or asynchronously.
                </p>

                <!-- Features -->
                <div style="background:#F9FAFB;border:1px solid #E5E7EB;border-radius:10px;padding:24px;margin-bottom:32px;">
                  <p style="margin:0 0 14px;color:#111827;font-size:14px;font-weight:600;">
                    What you can do with Async Board:
                  </p>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    <tr>
                      <td style="padding:6px 0;">
                        <p style="margin:0;color:#6B7280;font-size:14px;">
                           &nbsp; Draw and collaborate on infinite canvas
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;">
                        <p style="margin:0;color:#6B7280;font-size:14px;">
                           &nbsp; Invite team members to rooms
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;">
                        <p style="margin:0;color:#6B7280;font-size:14px;">
                           &nbsp; Sync changes in real time
                        </p>
                      </td>
                    </tr>
                    <tr>
                      <td style="padding:6px 0;">
                        <p style="margin:0;color:#6B7280;font-size:14px;">
                           &nbsp; Save and restore board snapshots
                        </p>
                      </td>
                    </tr>
                  </table>
                </div>

                <!-- CTA Button -->
                <div style="text-align:center;margin-bottom:32px;">
                  <a
    href="${ENV.CLIENT_URL}/dashboard"
    style="
      background:#6366F1;
      color:#FFFFFF;
      text-decoration:none;
      padding:14px 36px;
      border-radius:8px;
      font-weight:600;
      font-size:15px;
      display:inline-block;
    "
  >
    Open Async Board →
  </>
</div>

                <!-- Help notice -->
                <div style="
                  background:#F9FAFB;
                  border:1px solid #E5E7EB;
                  border-radius:8px;
                  padding:14px 18px;
                  margin-bottom:28px;
                ">
                  <p style="margin:0;color:#6B7280;font-size:14px;line-height:1.6;">
                     Have questions? Just reply to this email — our team is here to help.
                  </p>
                </div>

                <p style="margin:0;color:#111827;font-size:14px;font-weight:600;">
                  The Async Board Team
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td
                align="center"
                style="
                  background:#F9FAFB;
                  padding:20px;
                  border-top:1px solid #E5E7EB;
                "
              >
                <p style="margin:0;color:#9CA3AF;font-size:13px;">
                  © ${new Date().getFullYear()} Async Board. All rights reserved.
                </p>
                <p style="margin:6px 0 0;color:#9CA3AF;font-size:12px;">
                  You received this email because you created an account on Async Board.
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