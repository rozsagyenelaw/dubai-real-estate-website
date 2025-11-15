<?php
// Email Configuration
define('CONTACT_EMAIL', 'info@premierdubairealty.com');
define('SITE_EMAIL', 'noreply@premierdubairealty.com');
define('SITE_NAME', 'Premier Dubai Realty');

// SMTP Configuration (Optional - for better email delivery)
// If you want to use SMTP instead of PHP mail(), uncomment and configure below
/*
define('SMTP_HOST', 'smtp.your-email-provider.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@premierdubairealty.com');
define('SMTP_PASSWORD', 'your-password');
define('SMTP_ENCRYPTION', 'tls'); // or 'ssl'
*/

// Security Settings
define('ALLOWED_ORIGINS', [
    'http://localhost',
    'http://127.0.0.1',
    'https://yourdomain.com',
    'https://www.yourdomain.com'
]);

// Rate Limiting (optional)
define('RATE_LIMIT_ENABLED', true);
define('MAX_REQUESTS_PER_HOUR', 10);

// Timezone
date_default_timezone_set('Asia/Dubai');
