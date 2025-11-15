<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Load configuration
require_once __DIR__ . '/config.php';

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate email
if (empty($input['email'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Email address is required'
    ]);
    exit();
}

$email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email address'
    ]);
    exit();
}

// Prepare email content for admin notification
$to = CONTACT_EMAIL;
$subject = "New Newsletter Subscription - Premier Dubai Realty";

$emailBody = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%); color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
        .footer { text-align: center; font-size: 12px; color: #666; padding: 20px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Premier Dubai Realty</h1>
            <p>New Newsletter Subscription</p>
        </div>
        <div class='content'>
            <p><strong>Email:</strong> $email</p>
            <p><strong>Subscribed on:</strong> " . date('F j, Y, g:i a') . "</p>
            <p><strong>IP Address:</strong> " . $_SERVER['REMOTE_ADDR'] . "</p>
        </div>
    </div>
</body>
</html>
";

// Email headers
$headers = [
    'MIME-Version: 1.0',
    'Content-type: text/html; charset=UTF-8',
    'From: ' . SITE_NAME . ' <' . SITE_EMAIL . '>',
    'X-Mailer: PHP/' . phpversion()
];

// Send notification to admin
$mailSent = mail($to, $subject, $emailBody, implode("\r\n", $headers));

if ($mailSent) {
    // Send welcome email to subscriber
    sendWelcomeEmail($email);

    // Log subscription
    logNewsletter($email);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for subscribing! Check your email for a welcome message.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to subscribe. Please try again later.'
    ]);
}

function sendWelcomeEmail($subscriberEmail) {
    $subject = "Welcome to Premier Dubai Realty Newsletter";

    $body = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .button { display: inline-block; padding: 12px 30px; background: #ffd700; color: #1a1f3a; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; background: #1a1f3a; color: white; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Welcome to Premier Dubai Realty!</h1>
                <p>Your Journey to Dubai Real Estate Starts Here</p>
            </div>
            <div class='content'>
                <h2>Thank you for subscribing!</h2>
                <p>You're now part of our exclusive community. Here's what you can expect:</p>

                <ul>
                    <li><strong>Latest Properties:</strong> Be the first to know about new listings</li>
                    <li><strong>Market Insights:</strong> Expert analysis of Dubai real estate trends</li>
                    <li><strong>Exclusive Offers:</strong> Special deals for subscribers only</li>
                    <li><strong>Investment Tips:</strong> Maximize your property investment returns</li>
                </ul>

                <p>Explore our current featured properties:</p>
                <p style='text-align: center;'>
                    <a href='https://yourdomain.com/properties.html' class='button'>View Properties</a>
                </p>

                <p>Need help finding the perfect property?</p>
                <p>📞 Call us: +1 (818) 434-4541<br>
                💬 WhatsApp: +1 (818) 434-4541<br>
                📧 Email: info@premierdubairealty.com</p>

                <p>We're here to help you every step of the way!</p>

                <p>Best regards,<br>
                <strong>Premier Dubai Realty Team</strong></p>
            </div>
            <div class='footer'>
                <p>Sheikh Zayed Road, Dubai, UAE</p>
                <p>Email: info@premierdubairealty.com | Phone: +1 (818) 434-4541</p>
                <p style='font-size: 10px; margin-top: 10px;'>
                    You received this email because you subscribed to our newsletter.
                </p>
            </div>
        </div>
    </body>
    </html>
    ";

    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: ' . SITE_NAME . ' <' . SITE_EMAIL . '>',
        'X-Mailer: PHP/' . phpversion()
    ];

    mail($subscriberEmail, $subject, $body, implode("\r\n", $headers));
}

function logNewsletter($email) {
    $logFile = __DIR__ . '/logs/newsletter_subscriptions.log';
    $logDir = dirname($logFile);

    if (!file_exists($logDir)) {
        mkdir($logDir, 0755, true);
    }

    $logEntry = date('Y-m-d H:i:s') . ' - ' . $email . ' - ' . $_SERVER['REMOTE_ADDR'] . "\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND);
}
