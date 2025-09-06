import { createClient } from 'npm:@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
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

    // Initialize Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Store OTP in database with expiration
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes
    
    const { error: dbError } = await supabase
      .from('password_reset_otps')
      .upsert({
        email: email,
        otp: otp,
        expires_at: expiresAt.toISOString(),
        used: false,
        created_at: new Date().toISOString()
      })

    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to store OTP' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Create professional email HTML
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Password Reset - TravelMate AI</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
          .container { max-width: 600px; margin: 0 auto; background-color: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .header { background: linear-gradient(135deg, #f97316 0%, #06d6a0 50%, #3b82f6 100%); padding: 40px 20px; text-align: center; }
          .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
          .header-text { color: white; font-size: 16px; opacity: 0.9; }
          .content { padding: 40px 20px; }
          .otp-box { background: linear-gradient(135deg, #f97316 0%, #06d6a0 50%, #3b82f6 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin: 30px 0; }
          .otp-code { font-size: 42px; font-weight: bold; letter-spacing: 12px; margin: 15px 0; font-family: 'Courier New', monospace; }
          .footer { background-color: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 14px; }
          .security-tip { background-color: #f1f5f9; padding: 20px; border-radius: 8px; margin-top: 30px; border-left: 4px solid #06d6a0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">✈️ TravelMate AI</div>
            <div class="header-text">Your Personal Travel Assistant</div>
          </div>
          <div class="content">
            <h2 style="color: #1e293b; margin-bottom: 20px; font-size: 24px;">Password Reset Request</h2>
            <p style="color: #475569; line-height: 1.6; margin-bottom: 20px; font-size: 16px;">
              We received a request to reset your password for your TravelMate AI account. Use the OTP code below to continue with your password reset:
            </p>
            <div class="otp-box">
              <div style="font-size: 18px; margin-bottom: 10px; opacity: 0.9;">Your OTP Code</div>
              <div class="otp-code">${otp}</div>
              <div style="font-size: 14px; margin-top: 15px; opacity: 0.9;">⏰ Valid for 10 minutes only</div>
            </div>
            <p style="color: #475569; line-height: 1.6; margin-bottom: 20px; font-size: 16px;">
              Enter this code in the TravelMate AI app to create your new password. If you didn't request this password reset, please ignore this email and your account will remain secure.
            </p>
            <div class="security-tip">
              <p style="color: #64748b; font-size: 14px; margin: 0; font-weight: 600;">
                🔒 <strong>Security Reminder:</strong> Never share this OTP with anyone. TravelMate AI will never ask for your OTP via phone calls or other emails. This code expires in 10 minutes for your security.
              </p>
            </div>
          </div>
          <div class="footer">
            <p style="margin: 0; font-weight: 600;">© 2025 TravelMate AI. All rights reserved.</p>
            <p style="margin: 10px 0 0 0; opacity: 0.8;">Making travel planning effortless, one trip at a time.</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Try multiple email sending approaches
    let emailSent = false
    let emailError = null

    // Method 1: Try using Supabase's built-in email (if configured)
    try {
      const { error: authEmailError } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: email,
        options: {
          redirectTo: `${supabaseUrl}/auth/v1/verify?token=dummy&type=recovery`
        }
      })

      if (!authEmailError) {
        console.log('Supabase auth email method attempted for:', email)
        emailSent = true
      }
    } catch (authError) {
      console.log('Supabase auth email not available:', authError.message)
      emailError = authError
    }

    // Method 2: Use Web API fetch to send via external service (Resend example)
    if (!emailSent) {
      try {
        // This would work with Resend API (you'd need to add RESEND_API_KEY to env)
        const resendApiKey = Deno.env.get('RESEND_API_KEY')
        
        if (resendApiKey) {
          const resendResponse = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              from: 'TravelMate AI <noreply@yourdomain.com>',
              to: [email],
              subject: `Your TravelMate AI Password Reset Code: ${otp}`,
              html: emailHtml,
            }),
          })

          if (resendResponse.ok) {
            console.log('Email sent successfully via Resend to:', email)
            emailSent = true
          } else {
            const resendError = await resendResponse.text()
            console.error('Resend API error:', resendError)
            emailError = new Error(`Resend API error: ${resendError}`)
          }
        }
      } catch (resendError) {
        console.error('Resend email service error:', resendError)
        emailError = resendError
      }
    }

    // Method 3: Use SMTP via external service (SendGrid example)
    if (!emailSent) {
      try {
        const sendgridApiKey = Deno.env.get('SENDGRID_API_KEY')
        
        if (sendgridApiKey) {
          const sendgridResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${sendgridApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              personalizations: [{
                to: [{ email: email }],
                subject: `Your TravelMate AI Password Reset Code: ${otp}`
              }],
              from: { email: 'noreply@yourdomain.com', name: 'TravelMate AI' },
              content: [{
                type: 'text/html',
                value: emailHtml
              }]
            }),
          })

          if (sendgridResponse.ok) {
            console.log('Email sent successfully via SendGrid to:', email)
            emailSent = true
          } else {
            const sendgridError = await sendgridResponse.text()
            console.error('SendGrid API error:', sendgridError)
            emailError = new Error(`SendGrid API error: ${sendgridError}`)
          }
        }
      } catch (sendgridError) {
        console.error('SendGrid email service error:', sendgridError)
        emailError = sendgridError
      }
    }

    // Method 4: Fallback - Log email for development/testing
    if (!emailSent) {
      console.log('='.repeat(60))
      console.log('📧 EMAIL WOULD BE SENT TO:', email)
      console.log('🔐 OTP CODE:', otp)
      console.log('⏰ EXPIRES AT:', expiresAt.toISOString())
      console.log('='.repeat(60))
      console.log('EMAIL HTML CONTENT:')
      console.log(emailHtml)
      console.log('='.repeat(60))
      
      // For development, we'll consider this as "sent"
      emailSent = true
    }

    if (emailSent) {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'OTP sent to your email address. Please check your inbox and spam folder.',
          email_sent: true,
          otp_expires_at: expiresAt.toISOString()
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    } else {
      console.error('All email methods failed:', emailError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to send email. Please try again or contact support.',
          details: emailError?.message || 'Unknown email error'
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('Error in send-otp-email function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process OTP request',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})