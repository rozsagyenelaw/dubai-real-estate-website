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

// Validate required fields
$requiredFields = ['name', 'email', 'phone', 'message'];
foreach ($requiredFields as $field) {
    if (empty($input[$field])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => "Missing required field: $field"
        ]);
        exit();
    }
}

// Sanitize inputs
$name = htmlspecialchars(trim($input['name']));
$email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
$phone = htmlspecialchars(trim($input['phone']));
$message = htmlspecialchars(trim($input['message']));
$interest = htmlspecialchars(trim($input['interest'] ?? 'General Inquiry'));

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email address'
    ]);
    exit();
}

// Prepare email content
$to = CONTACT_EMAIL;
$subject = "New Contact Form Submission - Premier Dubai Realty";

$emailBody = "
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%); color: white; padding: 20px; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; margin: 20px 0; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #1a1f3a; }
        .value { margin-top: 5px; }
        .footer { text-align: center; font-size: 12px; color: #666; padding: 20px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Premier Dubai Realty</h1>
            <p>New Contact Form Submission</p>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Name:</div>
                <div class='value'>$name</div>
            </div>
            <div class='field'>
                <div class='label'>Email:</div>
                <div class='value'>$email</div>
            </div>
            <div class='field'>
                <div class='label'>Phone:</div>
                <div class='value'>$phone</div>
            </div>
            <div class='field'>
                <div class='label'>Interest:</div>
                <div class='value'>$interest</div>
            </div>
            <div class='field'>
                <div class='label'>Message:</div>
                <div class='value'>" . nl2br($message) . "</div>
            </div>
        </div>
        <div class='footer'>
            <p>Submitted on: " . date('F j, Y, g:i a') . "</p>
            <p>From: " . $_SERVER['REMOTE_ADDR'] . "</p>
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
    'Reply-To: ' . $name . ' <' . $email . '>',
    'X-Mailer: PHP/' . phpversion()
];

// Send email
$mailSent = mail($to, $subject, $emailBody, implode("\r\n", $headers));

if ($mailSent) {
    // Send auto-reply to customer
    sendAutoReply($email, $name);

    // Log submission (optional)
    logSubmission($input);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you for contacting us! We will get back to you shortly.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to send message. Please try again or contact us directly.'
    ]);
}

function sendAutoReply($customerEmail, $customerName) {
    $subject = "Thank you for contacting Premier Dubai Realty";

    $body = "
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1a1f3a 0%, #2d3561 100%); color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; background: #f9f9f9; }
            .footer { text-align: center; padding: 20px; background: #1a1f3a; color: white; }
        </style>
    </head>
    <body>
        <div class='container'>
            <div class='header'>
                <h1>Premier Dubai Realty</h1>
                <p>Your Trusted Real Estate Partner in Dubai</p>
            </div>
            <div class='content'>
                <h2>Dear $customerName,</h2>
                <p>Thank you for contacting Premier Dubai Realty. We have received your inquiry and one of our expert real estate consultants will get back to you within 24 hours.</p>

                <p>In the meantime, feel free to:</p>
                <ul>
                    <li>Browse our latest properties on our website</li>
                    <li>Call us directly at +1 (818) 434-4541</li>
                    <li>Message us on WhatsApp at +1 (818) 434-4541</li>
                </ul>

                <p>We look forward to helping you find your perfect property in Dubai!</p>

                <p>Best regards,<br>
                <strong>Premier Dubai Realty Team</strong></p>
            </div>
            <div class='footer'>
                <p>Sheikh Zayed Road, Dubai, UAE</p>
                <p>Email: info@premierdubairealty.com | Phone: +1 (818) 434-4541</p>
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

    mail($customerEmail, $subject, $body, implode("\r\n", $headers));
}

function logSubmission($data) {
    $logFile = __DIR__ . '/logs/contact_submissions.log';
    $logDir = dirname($logFile);

    if (!file_exists($logDir)) {
        mkdir($logDir, 0755, true);
    }

    $logEntry = date('Y-m-d H:i:s') . ' - ' . json_encode($data) . "\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND);
}
