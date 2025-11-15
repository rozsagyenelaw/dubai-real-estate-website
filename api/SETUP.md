# Backend Setup Instructions

## Overview
This backend system handles contact form submissions and download requests for Premier Dubai Realty website. It sends professional HTML emails to both the admin and customers.

## Requirements
- PHP 7.4 or higher
- PHP `mail()` function enabled on server
- Apache server with `.htaccess` support (or equivalent for Nginx)

## Installation Steps

### 1. Upload Files
Upload the entire `api` folder to your web server:
```
your-website/
├── api/
│   ├── contact.php
│   ├── download-request.php
│   ├── config.php
│   ├── .htaccess
│   └── logs/
```

### 2. Configure Email Settings
Edit `api/config.php` and update the following:

```php
define('CONTACT_EMAIL', 'info@premierdubairealty.com'); // Where form submissions are sent
define('SITE_EMAIL', 'noreply@premierdubairealty.com'); // From address for emails
```

### 3. Set Directory Permissions
Ensure the logs directory is writable:
```bash
chmod 755 api/logs
```

### 4. Test the Setup
1. Visit your website
2. Fill out the contact form
3. Check that you receive an email at `info@premierdubairealty.com`
4. Check that the customer receives an auto-reply

## Email Delivery Options

### Option 1: PHP mail() (Current Setup)
- **Pros:** Simple, no additional setup
- **Cons:** May go to spam, limited delivery rates
- **Best for:** Testing, small websites

### Option 2: SMTP (Recommended for Production)
For better email delivery, use SMTP. Install PHPMailer:

```bash
composer require phpmailer/phpmailer
```

Then update `config.php` to enable SMTP and add these settings:
```php
define('SMTP_HOST', 'smtp.gmail.com'); // or your email provider
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@premierdubairealty.com');
define('SMTP_PASSWORD', 'your-app-password');
define('SMTP_ENCRYPTION', 'tls');
```

### Option 3: Third-Party Email Services (Professional)
Consider using:
- **SendGrid** (Free tier: 100 emails/day)
- **Mailgun** (Free tier: 5,000 emails/month)
- **Amazon SES** (Very cheap, highly reliable)
- **Postmark** (Excellent deliverability)

## Security Features

### Already Implemented:
✅ Input sanitization and validation
✅ CSRF protection via same-origin policy
✅ Rate limiting support
✅ Protected config files via `.htaccess`
✅ Logging of all submissions
✅ XSS prevention

### Additional Recommendations:
1. **Add CAPTCHA** to prevent spam (Google reCAPTCHA v3)
2. **Use HTTPS** - Essential for production
3. **Regular log monitoring** - Check logs for suspicious activity
4. **Backup logs** - Archive logs regularly

## Troubleshooting

### Emails Not Sending
1. Check PHP mail() is enabled: Create a test file with `<?php echo (function_exists('mail') ? 'Enabled' : 'Disabled'); ?>`
2. Check server mail logs (usually `/var/log/mail.log`)
3. Verify your server's hostname is configured correctly
4. Check spam folders
5. Consider using SMTP instead

### Permission Errors
```bash
chmod 755 api/logs
chown www-data:www-data api/logs  # Replace www-data with your web server user
```

### CORS Errors
If you're testing locally or from a different domain:
1. Check the `.htaccess` file has correct CORS headers
2. Update `ALLOWED_ORIGINS` in `config.php`

## Server-Specific Notes

### Shared Hosting (cPanel, Plesk)
- Usually works out of the box
- May need to enable PHP mail() in control panel
- Check for email sending limits

### VPS/Dedicated Server
- Ensure sendmail or postfix is installed
- Configure SPF and DKIM records for your domain
- Set up reverse DNS

### Cloud Hosting (AWS, Google Cloud, Azure)
- Many cloud providers block port 25 by default
- Use SMTP option with authenticated email service
- Consider using managed email service (SES, SendGrid, etc.)

## Monitoring

### Check Logs
Log files are stored in `api/logs/`:
- `contact_submissions.log` - All contact form submissions
- `download_requests.log` - All download requests

### Example Log Entry
```
2024-01-15 14:30:22 - {"name":"John Doe","email":"john@example.com","phone":"50 123 4567","message":"Interested in BAYZ 101"}
```

## Testing Checklist

- [ ] Contact form submits successfully
- [ ] Admin receives email at info@premierdubairealty.com
- [ ] Customer receives auto-reply email
- [ ] Download form captures lead information
- [ ] Customer receives download link via email
- [ ] Form validation works (required fields)
- [ ] Error messages display correctly
- [ ] Emails are properly formatted (HTML)
- [ ] Logs are being created
- [ ] No PHP errors in server logs

## Production Deployment

Before going live:

1. **Update config.php:**
   - Set correct email addresses
   - Enable rate limiting
   - Add your domain to ALLOWED_ORIGINS

2. **Email Configuration:**
   - Set up SPF records for your domain
   - Set up DKIM signing
   - Configure DMARC policy
   - Test email deliverability

3. **Security:**
   - Enable HTTPS
   - Add reCAPTCHA (optional but recommended)
   - Set up regular log backups
   - Monitor for abuse

4. **Testing:**
   - Test all forms thoroughly
   - Check emails don't go to spam
   - Verify auto-replies work
   - Test on mobile devices

## Support

For issues or questions:
- Check server error logs
- Review PHP error logs
- Check email server logs
- Test with simple email first

## Alternative: Serverless Deployment

If you prefer serverless, here's a Netlify Functions example:

### netlify/functions/contact.js
```javascript
const nodemailer = require('nodemailer');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const data = JSON.parse(event.body);

  // Configure nodemailer with your SMTP settings
  const transporter = nodemailer.createTransporter({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Send email
  await transporter.sendMail({
    from: '"Premier Dubai Realty" <noreply@premierdubairealty.com>',
    to: 'info@premierdubairealty.com',
    subject: 'New Contact Form Submission',
    html: `<p>Name: ${data.name}</p><p>Email: ${data.email}</p>`
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ success: true })
  };
};
```

Then update your JavaScript to use:
```javascript
const response = await fetch('/.netlify/functions/contact', {
  method: 'POST',
  body: JSON.stringify(data)
});
```
