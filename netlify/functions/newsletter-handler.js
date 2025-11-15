// Netlify Function for Newsletter Subscriptions

const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { email } = data;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: 'Valid email address is required'
        })
      };
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Notify admin of new subscriber
    const adminEmail = {
      from: `"Premier Dubai Realty" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'info@premierdubairealty.com',
      subject: '📧 New Newsletter Subscription',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: #f9f9f9; padding: 30px; border-radius: 8px;">
            <h2 style="color: #1a1f3a;">📧 New Newsletter Subscriber</h2>
            <div style="background: white; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0;">
              <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 10px 0 0; font-size: 12px; color: #666;">
                Subscribed: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' })} (Dubai Time)
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Welcome email to subscriber
    const welcomeEmail = {
      from: `"Premier Dubai Realty" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Welcome to Premier Dubai Realty Newsletter! 🏠',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.8; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%); color: white; padding: 40px 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 40px 30px; }
            .button { display: inline-block; padding: 15px 40px; background: #d4af37; color: #1a1f3a; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .feature-box { background: white; padding: 20px; margin: 15px 0; border-radius: 6px; border-left: 4px solid #d4af37; }
            .footer { background: #1a1f3a; color: white; padding: 30px; text-align: center; }
          </style>
        </head>
        <body>
          <div class='container'>
            <div class='header'>
              <h1>🏠 Welcome to Premier Dubai Realty!</h1>
              <p style="font-size: 18px; margin: 10px 0 0;">You're now part of our exclusive community</p>
            </div>
            <div class='content'>
              <h2 style="color: #1a1f3a;">Thank You for Subscribing! 🎉</h2>

              <p>We're thrilled to have you join our community of savvy property investors and home seekers in Dubai!</p>

              <h3 style="color: #1a1f3a;">What You'll Receive:</h3>

              <div class='feature-box'>
                <h4 style="margin: 0 0 10px; color: #1a1f3a;">🏢 Latest Property Listings</h4>
                <p style="margin: 0; color: #666;">Be the first to know about new properties hitting the market</p>
              </div>

              <div class='feature-box'>
                <h4 style="margin: 0 0 10px; color: #1a1f3a;">📊 Market Insights</h4>
                <p style="margin: 0; color: #666;">Expert analysis of Dubai real estate trends and opportunities</p>
              </div>

              <div class='feature-box'>
                <h4 style="margin: 0 0 10px; color: #1a1f3a;">💎 Exclusive Offers</h4>
                <p style="margin: 0; color: #666;">Special deals and payment plans for subscribers only</p>
              </div>

              <div class='feature-box'>
                <h4 style="margin: 0 0 10px; color: #1a1f3a;">💡 Investment Tips</h4>
                <p style="margin: 0; color: #666;">Maximize your property investment returns in Dubai</p>
              </div>

              <h3 style="color: #1a1f3a; margin-top: 40px;">Start Exploring Now!</h3>
              <p>Check out our current featured properties:</p>

              <p style="text-align: center;">
                <a href="https://premierdubairealty.com/properties.html" class="button">Browse Properties</a>
              </p>

              <div style="background: white; padding: 25px; margin: 30px 0; border-radius: 6px; text-align: center;">
                <h3 style="margin: 0 0 15px; color: #1a1f3a;">Need Help Right Now?</h3>
                <p style="margin: 10px 0;">📞 <strong>Call:</strong> <a href="tel:+18184344541" style="color: #1a1f3a;">+1 (818) 434-4541</a></p>
                <p style="margin: 10px 0;">💬 <strong>WhatsApp:</strong> <a href="https://wa.me/18184344541" style="color: #1a1f3a;">+1 (818) 434-4541</a></p>
                <p style="margin: 10px 0;">📧 <strong>Email:</strong> <a href="mailto:info@premierdubairealty.com" style="color: #1a1f3a;">info@premierdubairealty.com</a></p>
              </div>

              <p>Looking forward to helping you find your perfect property in Dubai!</p>

              <p>Best regards,<br>
              <strong>The Premier Dubai Realty Team</strong></p>
            </div>
            <div class='footer'>
              <p style="margin: 10px 0;">📍 Sheikh Zayed Road, Dubai, UAE</p>
              <p style="margin: 10px 0;">📞 +1 (818) 434-4541 | 📧 info@premierdubairealty.com</p>
              <p style="margin-top: 20px; font-size: 11px; opacity: 0.8;">
                © ${new Date().getFullYear()} Premier Dubai Realty. All rights reserved.<br>
                <a href="#" style="color: #d4af37; text-decoration: none;">Unsubscribe</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send both emails
    await transporter.sendMail(adminEmail);
    await transporter.sendMail(welcomeEmail);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Thank you for subscribing! Check your email for a welcome message.'
      })
    };

  } catch (error) {
    console.error('Newsletter handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'An error occurred. Please try again.'
      })
    };
  }
};
