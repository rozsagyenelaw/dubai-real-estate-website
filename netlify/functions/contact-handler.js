// Netlify Function for Contact Form
// Handles contact form submissions with email notifications

const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    // Parse form data
    const data = JSON.parse(event.body);
    const { name, email, phone, interest, message } = data;

    // Validate required fields
    if (!name || !email || !phone || !message) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: 'Missing required fields'
        })
      };
    }

    // Email configuration using environment variables
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });

    // Email to admin
    const adminEmail = {
      from: `"Premier Dubai Realty" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'info@premierdubairealty.com',
      replyTo: `${name} <${email}>`,
      subject: 'New Contact Form Submission - Premier Dubai Realty',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%); color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 20px; padding: 15px; background: white; border-radius: 6px; }
            .label { font-weight: bold; color: #1a1f3a; font-size: 14px; text-transform: uppercase; }
            .value { margin-top: 8px; font-size: 16px; color: #333; }
            .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class='container'>
            <div class='header'>
              <h1>🏠 Premier Dubai Realty</h1>
              <p>New Contact Form Submission</p>
            </div>
            <div class='content'>
              <div class='field'>
                <div class='label'>👤 Name</div>
                <div class='value'>${name}</div>
              </div>
              <div class='field'>
                <div class='label'>📧 Email</div>
                <div class='value'><a href="mailto:${email}">${email}</a></div>
              </div>
              <div class='field'>
                <div class='label'>📱 Phone</div>
                <div class='value'><a href="tel:${phone}">${phone}</a></div>
              </div>
              ${interest ? `
              <div class='field'>
                <div class='label'>🎯 Interest</div>
                <div class='value'>${interest}</div>
              </div>
              ` : ''}
              <div class='field'>
                <div class='label'>💬 Message</div>
                <div class='value'>${message.replace(/\n/g, '<br>')}</div>
              </div>
              <div class='footer'>
                <p>Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' })} (Dubai Time)</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Auto-reply to customer
    const customerEmail = {
      from: `"Premier Dubai Realty" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Thank you for contacting Premier Dubai Realty',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.8; color: #333; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 40px 30px; }
            .button { display: inline-block; padding: 15px 40px; background: #d4af37; color: #1a1f3a; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
            .contact-box { background: white; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0; }
            .footer { background: #1a1f3a; color: white; padding: 30px; text-align: center; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class='container'>
            <div class='header'>
              <h1>🏠 Premier Dubai Realty</h1>
              <p style="font-size: 18px; margin: 10px 0 0 0;">Your Trusted Real Estate Partner in Dubai</p>
            </div>
            <div class='content'>
              <h2>Dear ${name},</h2>
              <p>Thank you for reaching out to Premier Dubai Realty! We've received your inquiry and one of our expert real estate consultants will contact you within <strong>24 hours</strong>.</p>

              <div class='contact-box'>
                <h3 style="margin-top: 0; color: #1a1f3a;">Need Immediate Assistance?</h3>
                <p style="margin: 10px 0;">📞 <strong>Call:</strong> <a href="tel:+18184344541">+1 (818) 434-4541</a></p>
                <p style="margin: 10px 0;">💬 <strong>WhatsApp:</strong> <a href="https://wa.me/18184344541">+1 (818) 434-4541</a></p>
                <p style="margin: 10px 0;">📧 <strong>Email:</strong> <a href="mailto:info@premierdubairealty.com">info@premierdubairealty.com</a></p>
              </div>

              <p>In the meantime, feel free to:</p>
              <ul>
                <li>Browse our <a href="https://premierdubairealty.com/properties.html">latest property listings</a></li>
                <li>Explore <a href="https://premierdubairealty.com/off-plan.html">off-plan investment opportunities</a></li>
                <li>Learn about <a href="https://premierdubairealty.com/why-dubai.html">investing in Dubai</a></li>
              </ul>

              <p style="text-align: center; margin: 30px 0;">
                <a href="https://premierdubairealty.com/properties.html" class="button">View Properties</a>
              </p>

              <p>We look forward to helping you find your perfect property in Dubai!</p>

              <p>Best regards,<br>
              <strong>The Premier Dubai Realty Team</strong></p>
            </div>
            <div class='footer'>
              <p style="margin: 10px 0;">📍 Sheikh Zayed Road, Dubai, UAE</p>
              <p style="margin: 10px 0;">📞 +1 (818) 434-4541 | 📧 info@premierdubairealty.com</p>
              <p style="margin-top: 20px; font-size: 11px; opacity: 0.8;">
                © ${new Date().getFullYear()} Premier Dubai Realty. All rights reserved.
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Send both emails
    await transporter.sendMail(adminEmail);
    await transporter.sendMail(customerEmail);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        message: 'Thank you for contacting us! We will get back to you shortly.'
      })
    };

  } catch (error) {
    console.error('Contact form error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'An error occurred. Please try again or contact us directly.'
      })
    };
  }
};
