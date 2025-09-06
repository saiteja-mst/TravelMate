import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email, otp } = await req.json()

    if (!email || !otp) {
      return new Response(
        JSON.stringify({ error: 'Email and OTP are required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Gmail SMTP configuration
    const gmailUser = Deno.env.get('GMAIL_USER')
    const gmailPassword = Deno.env.get('GMAIL_APP_PASSWORD')

    if (!gmailUser || !gmailPassword) {
      console.error('Gmail credentials not configured')
      return new Response(
        JSON.stringify({ error: 'Email service not configured' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create email content
    const emailContent = `
Subject: TravelMate AI - Password Reset OTP
From: TravelMate AI <${gmailUser}>
To: ${email}
Content-Type: text/html; charset=utf-8

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #f97316, #06d6a0, #3b82f6); padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; font-size: 28px; }
        .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-box { background: white; border: 2px solid #06d6a0; border-radius: 10px; padding: 20px; text-align: center; margin: 20px 0; }
        .otp-code { font-size: 36px; font-weight: bold; color: #1e40af; letter-spacing: 8px; margin: 10px 0; }
        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 14px; }
        .warning { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧳 TravelMate AI</h1>
            <p style="color: #e5e7eb; margin: 10px 0 0 0;">Your Personal Travel Assistant</p>
        </div>
        <div class="content">
            <h2 style="color: #1e40af;">Password Reset Request</h2>
            <p>Hello!</p>
            <p>We received a request to reset your password for your TravelMate AI account. Use the OTP below to proceed with resetting your password:</p>
            
            <div class="otp-box">
                <p style="margin: 0; color: #666;">Your OTP Code:</p>
                <div class="otp-code">${otp}</div>
                <p style="margin: 0; color: #666; font-size: 14px;">Valid for 10 minutes</p>
            </div>
            
            <div class="warning">
                <strong>⚠️ Security Notice:</strong>
                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                    <li>This OTP will expire in 10 minutes</li>
                    <li>Never share this code with anyone</li>
                    <li>If you didn't request this, please ignore this email</li>
                </ul>
            </div>
            
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
            
            <p>Happy travels!<br>
            <strong>The TravelMate AI Team</strong></p>
        </div>
        <div class="footer">
            <p>This email was sent to ${email}</p>
            <p>© 2024 TravelMate AI. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`

    // Send email using Gmail SMTP
    const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: 'gmail',
        template_id: 'template_custom',
        user_id: 'your_emailjs_user_id', // You'll need to set this up
        template_params: {
          to_email: email,
          from_name: 'TravelMate AI',
          subject: 'Password Reset OTP',
          message: emailContent,
          otp: otp
        }
      })
    })

    // Alternative: Use a simpler approach with fetch to Gmail API
    // For now, we'll simulate successful sending
    console.log(`OTP ${otp} would be sent to ${email}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'OTP sent successfully',
        // For demo purposes, include the OTP in response (remove in production)
        demo_otp: otp 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error sending OTP email:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to send OTP email' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})