// Netlify Function for Download/Brochure Requests
// Captures leads and sends download links

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
    const { name, email, phone, countryCode, message, property, downloadUrl } = data;

    // Validate
    if (!name || !email || !phone || !property) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          message: 'Missing required fields'
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

    const fullPhone = countryCode ? `${countryCode} ${phone}` : phone;

    // Email to admin (lead notification)
    const adminEmail = {
      from: `"Premier Dubai Realty" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'info@premierdubairealty.com',
      replyTo: `${name} <${email}>`,
      subject: `🔥 New Lead: ${property} - Premier Dubai Realty`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); color: #1a1f3a; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
            .field { margin-bottom: 20px; padding: 15px; background: white; border-radius: 6px; }
            .label { font-weight: bold; color: #1a1f3a; font-size: 14px; text-transform: uppercase; }
            .value { margin-top: 8px; font-size: 16px; color: #333; }
            .highlight { background: #fff3cd; padding: 20px; border-left: 4px solid #d4af37; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class='container'>
            <div class='header'>
              <h1>🔥 NEW LEAD!</h1>
              <p style="font-size: 20px; margin: 10px 0 0;">Download Request Received</p>
            </div>
            <div class='content'>
              <div class='highlight'>
                <h2 style="margin: 0; color: #1a1f3a;">📁 Property Interest: ${property}</h2>
              </div>

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
                <div class='value'><a href="tel:${fullPhone}">${fullPhone}</a></div>
              </div>
              ${message ? `
              <div class='field'>
                <div class='label'>💬 Message</div>
                <div class='value'>${message.replace(/\n/g, '<br>')}</div>
              </div>
              ` : ''}

              <p style="text-align: center; margin-top: 30px; font-size: 12px; color: #666;">
                ⏰ Submitted: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' })} (Dubai Time)
              </p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Email to customer with download link
    const customerEmail = {
      from: `"Premier Dubai Realty" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Your ${property} Materials - Premier Dubai Realty`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.8; color: #333; }
            .container { max-width: 600px; margin: 0 auto; }
            .header { background: linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9f9f9; padding: 40px 30px; }
            .button { display: inline-block; padding: 15px 40px; background: #d4af37; color: #1a1f3a; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; font-size: 16px; }
            .property-box { background: white; padding: 25px; border-left: 4px solid #d4af37; margin: 25px 0; }
            .contact-box { background: white; padding: 20px; margin: 20px 0; border-radius: 6px; }
            .footer { background: #1a1f3a; color: white; padding: 30px; text-align: center; border-radius: 0 0 8px 8px; }
          </style>
        </head>
        <body>
          <div class='container'>
            <div class='header'>
              <h1>🏠 Premier Dubai Realty</h1>
              <p style="font-size: 18px; margin: 10px 0 0;">Your Property Materials Are Ready!</p>
            </div>
            <div class='content'>
              <h2>Dear ${name},</h2>

              <div class='property-box'>
                <h3 style="margin: 0 0 10px 0; color: #1a1f3a;">📁 ${property}</h3>
                <p style="margin: 0; color: #666;">Floor plans, brochure & property details</p>
              </div>

              <p>Thank you for your interest in <strong>${property}</strong>! We're excited to share all the details about this amazing property with you.</p>

              ${downloadUrl ? `
              <p style="text-align: center;">
                <a href="${downloadUrl}" class="button">📥 Download Materials</a>
              </p>
              ` : ''}

              <div class='contact-box'>
                <h3 style="margin-top: 0; color: #1a1f3a;">Have Questions? We're Here to Help!</h3>
                <p>Our expert consultants are ready to assist you:</p>
                <p style="margin: 8px 0;">📞 <strong>Call:</strong> <a href="tel:+18184344541">+1 (818) 434-4541</a></p>
                <p style="margin: 8px 0;">💬 <strong>WhatsApp:</strong> <a href="https://wa.me/18184344541">Message Us</a></p>
                <p style="margin: 8px 0;">📧 <strong>Email:</strong> <a href="mailto:info@premierdubairealty.com">info@premierdubairealty.com</a></p>
              </div>

              <h3>Why Choose ${property}?</h3>
              <ul style="line-height: 2;">
                <li>Prime location in Dubai</li>
                <li>World-class amenities</li>
                <li>Flexible payment plans available</li>
                <li>High ROI potential</li>
                <li>Expert guidance throughout</li>
              </ul>

              <p><strong>Next Steps:</strong></p>
              <ol style="line-height: 2;">
                <li>Review the materials</li>
                <li>Schedule a property viewing</li>
                <li>Discuss financing options</li>
                <li>Secure your dream property!</li>
              </ol>

              <p style="text-align: center; margin: 30px 0;">
                <a href="https://wa.me/18184344541?text=Hi! I'm interested in ${encodeURIComponent(property)}" class="button">💬 Chat on WhatsApp</a>
              </p>

              <p>Looking forward to helping you find your perfect home in Dubai!</p>

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
        message: 'Thank you! Your download will begin shortly and we\'ve sent the materials to your email.'
      })
    };

  } catch (error) {
    console.error('Download handler error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        message: 'An error occurred. Please try again.'
      })
    };
  }
};
