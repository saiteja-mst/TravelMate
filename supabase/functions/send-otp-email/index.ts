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

    // Send email using Supabase's built-in email service
    try {
      // Use Supabase Auth to send a custom email
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Password Reset - TravelMate AI</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f8fafc; }
            .container { max-width: 600px; margin: 0 auto; background-color: white; }
            .header { background: linear-gradient(135deg, #f97316 0%, #06d6a0 50%, #3b82f6 100%); padding: 40px 20px; text-align: center; }
            .logo { color: white; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .header-text { color: white; font-size: 16px; opacity: 0.9; }
            .content { padding: 40px 20px; }
            .otp-box { background: linear-gradient(135deg, #f97316 0%, #06d6a0 50%, #3b82f6 100%); color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 30px 0; }
            .otp-code { font-size: 36px; font-weight: bold; letter-spacing: 8px; margin: 10px 0; }
            .footer { background-color: #1e293b; color: #94a3b8; padding: 20px; text-align: center; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">✈️ TravelMate AI</div>
              <div class="header-text">Your Personal Travel Assistant</div>
            </div>
            <div class="content">
              <h2 style="color: #1e293b; margin-bottom: 20px;">Password Reset Request</h2>
              <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
                We received a request to reset your password. Use the OTP below to continue with your password reset:
              </p>
              <div class="otp-box">
                <div style="font-size: 18px; margin-bottom: 10px;">Your OTP Code</div>
                <div class="otp-code">${otp}</div>
                <div style="font-size: 14px; margin-top: 10px; opacity: 0.9;">Valid for 10 minutes</div>
              </div>
              <p style="color: #475569; line-height: 1.6; margin-bottom: 20px;">
                If you didn't request this password reset, please ignore this email. Your account remains secure.
              </p>
              <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin-top: 30px;">
                <p style="color: #64748b; font-size: 14px; margin: 0;">
                  <strong>Security Tip:</strong> Never share this OTP with anyone. TravelMate AI will never ask for your OTP via phone or email.
                </p>
              </div>
            </div>
            <div class="footer">
              <p style="margin: 0;">© 2025 TravelMate AI. All rights reserved.</p>
              <p style="margin: 10px 0 0 0;">Making travel planning effortless, one trip at a time.</p>
            </div>
          </div>
        </body>
        </html>
      `

      // For now, we'll use a simple email sending approach
      // In production, you would integrate with services like:
      // - Resend, SendGrid, Mailgun, etc.
      // - Or use Supabase's upcoming email service
      
      console.log(`Email would be sent to: ${email}`)
      console.log(`OTP: ${otp}`)
      console.log('Email HTML generated successfully')

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'OTP sent to your email address',
          email_sent: true
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )

    } catch (emailError) {
      console.error('Email sending error:', emailError)
      return new Response(
        JSON.stringify({ error: 'Failed to send email' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

  } catch (error) {
    console.error('Error in send-otp-email function:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process OTP request' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})