<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Quote Request</title>
</head>
<body style="margin:0; padding:0; background-color:#f3f6f1; font-family:'Segoe UI', Helvetica, Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f6f1; padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px; width:100%;">

          <tr>
            <td style="background-color:#1B3D2B; border-radius:14px 14px 0 0; padding:28px 36px;" align="center">
              <img src="{{ asset('assets/images/logo.png') }}" alt="Brighton Lawn &amp; Landscape" width="180" style="display:block; max-width:180px; height:auto;">
            </td>
          </tr>

          <tr>
            <td style="background-color:#52A03C; padding:14px 36px;" align="center">
              <span style="color:#ffffff; font-size:13px; font-weight:600; letter-spacing:2px; text-transform:uppercase;">New Quote Request</span>
            </td>
          </tr>

          <tr>
            <td style="background-color:#ffffff; padding:36px;">
              <h1 style="margin:0 0 6px; color:#1B3D2B; font-size:22px;">{{ $submission->name }}</h1>
              <p style="margin:0 0 24px; color:#5f6f63; font-size:14px;">
                Submitted {{ $submission->created_at->format('F j, Y \a\t g:i A') }}
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
                <tr>
                  <td style="padding:12px 0; border-top:1px solid #e8ede8; color:#8a978a; font-size:12px; text-transform:uppercase; letter-spacing:1px; width:160px;">Phone</td>
                  <td style="padding:12px 0; border-top:1px solid #e8ede8; color:#233029; font-size:15px;">
                    <a href="tel:{{ preg_replace('/\D/', '', $submission->phone) }}" style="color:#2a5c3f; text-decoration:none; font-weight:600;">{{ $submission->phone }}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0; border-top:1px solid #e8ede8; color:#8a978a; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Email</td>
                  <td style="padding:12px 0; border-top:1px solid #e8ede8; color:#233029; font-size:15px;">
                    <a href="mailto:{{ $submission->email }}" style="color:#2a5c3f; text-decoration:none; font-weight:600;">{{ $submission->email }}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0; border-top:1px solid #e8ede8; color:#8a978a; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Property Type</td>
                  <td style="padding:12px 0; border-top:1px solid #e8ede8;">
                    <span style="display:inline-block; background-color:#edf6ed; color:#2a5c3f; font-size:13px; font-weight:600; padding:4px 12px; border-radius:999px; text-transform:capitalize;">{{ $submission->property_type }}</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:12px 0; border-top:1px solid #e8ede8; color:#8a978a; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Service Needed</td>
                  <td style="padding:12px 0; border-top:1px solid #e8ede8; color:#233029; font-size:15px;">{{ $submission->service ?: 'Not specified' }}</td>
                </tr>
              </table>

              <div style="margin-top:24px; background-color:#f3f6f1; border-left:4px solid #52A03C; border-radius:0 10px 10px 0; padding:18px 22px;">
                <p style="margin:0 0 6px; color:#8a978a; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Project Details</p>
                <p style="margin:0; color:#233029; font-size:15px; line-height:1.6;">{{ $submission->details ?: 'None provided.' }}</p>
              </div>

              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:28px;">
                <tr>
                  <td style="background-color:#52A03C; border-radius:10px;">
                    <a href="{{ url('/admin/contact-submissions') }}" style="display:inline-block; padding:13px 28px; color:#ffffff; font-size:14px; font-weight:600; text-decoration:none;">Open in Admin Panel</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color:#1B3D2B; border-radius:0 0 14px 14px; padding:22px 36px;" align="center">
              <p style="margin:0; color:#9fb8a8; font-size:12px;">
                Brighton Lawn &amp; Landscape &middot; New Jersey &amp; Pennsylvania &middot; (848) 226-0090
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
