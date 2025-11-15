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
$requiredFields = ['name', 'email', 'phone', 'downloadRequested'];
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
$countryCode = htmlspecialchars(trim($input['countryCode'] ?? '+971'));
$message = htmlspecialchars(trim($input['message'] ?? 'N/A'));
$downloadRequested = htmlspecialchars(trim($input['downloadRequested']));
$downloadUrl = htmlspecialchars(trim($input['downloadUrl'] ?? 'N/A'));

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email address'
    ]);
    exit();
}

// Prepare email content for admin
$to = CONTACT_EMAIL;
$subject = "New Download Request - Premier Dubai Realty";

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
        .highlight { background: #ffd700; padding: 2px 5px; }
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <h1>Premier Dubai Realty</h1>
            <p>New Download Request</p>
        </div>
        <div class='content'>
            <div class='field'>
                <div class='label'>Download Material:</div>
                <div class='value'><span class='highlight'>$downloadRequested</span></div>
            </div>
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
                <div class='value'>$countryCode $phone</div>
            </div>
            <div class='field'>
                <div class='label'>Message:</div>
                <div class='value'>" . nl2br($message) . "</div>
            </div>
            <div class='field'>
                <div class='label'>File Requested:</div>
                <div class='value'>$downloadUrl</div>
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

// Send email to admin
$mailSent = mail($to, $subject, $emailBody, implode("\r\n", $headers));

if ($mailSent) {
    // Send email with download link to customer
    sendDownloadEmail($email, $name, $downloadRequested, $downloadUrl);

    // Log submission
    logDownloadRequest($input);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Thank you! Your download will begin shortly and we\'ve sent the materials to your email.'
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Failed to process request. Please try again.'
    ]);
}

function sendDownloadEmail($customerEmail, $customerName, $downloadName, $downloadUrl) {
    $subject = "Your Download: $downloadName - Premier Dubai Realty";

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
                <h1>Premier Dubai Realty</h1>
                <p>Your Property Materials Are Ready!</p>
            </div>
            <div class='content'>
                <h2>Dear $customerName,</h2>
                <p>Thank you for your interest in <strong>$downloadName</strong>!</p>

                <p>We've attached the materials you requested. You can also download them using the button below:</p>

                <p style='text-align: center;'>
                    <a href='$downloadUrl' class='button'>Download Materials</a>
                </p>

                <p>Our expert real estate consultants are here to answer any questions you may have about this property or any other inquiries.</p>

                <p><strong>Contact us:</strong></p>
                <ul>
                    <li>Phone: +1 (818) 434-4541</li>
                    <li>WhatsApp: +1 (818) 434-4541</li>
                    <li>Email: info@premierdubairealty.com</li>
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

function logDownloadRequest($data) {
    $logFile = __DIR__ . '/logs/download_requests.log';
    $logDir = dirname($logFile);

    if (!file_exists($logDir)) {
        mkdir($logDir, 0755, true);
    }

    $logEntry = date('Y-m-d H:i:s') . ' - ' . json_encode($data) . "\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND);
}
