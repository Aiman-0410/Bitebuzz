<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include database configuration
include 'conf.php';

// Log raw JSON input for debugging
error_log("Received Raw JSON: " . file_get_contents("php://input"));

// Check database connection
if (!$conn) {
    echo json_encode(["success" => false, "message" => "Database connection failed: " . mysqli_connect_error()]);
    exit;
}

// Decode JSON input
$data = json_decode(file_get_contents("php://input"), true);

if (!is_array($data)) {
    echo json_encode(["success" => false, "message" => "Invalid request format."]);
    exit;
}

if (!isset($data['password']) || !is_string($data['password'])) {
    echo json_encode(["success" => false, "message" => "Password must be a string."]);
    exit;
}

// Sanitize inputs
$username = mysqli_real_escape_string($conn, $data['username']);
$phone = mysqli_real_escape_string($conn, $data['phone']);
if ($phone === '') {
    echo json_encode(["success" => false, "message" => "Phone number is required."]);
    exit;
}
$password = $data['password']; // Plain text (Not recommended)
error_log("Received Data: " . print_r($data, true));



// Log received password for debugging
error_log("Received Password: " . var_export($password, true));

// Validate password structure
if (!preg_match('/[A-Z]/', $password)) {
    echo json_encode(["success" => false, "message" => "Password must contain at least one uppercase letter."]);
    exit;
}
if (!preg_match('/[a-z]/', $password)) {
    echo json_encode(["success" => false, "message" => "Password must contain at least one lowercase letter."]);
    exit;
}
if (!preg_match('/\d/', $password)) {
    echo json_encode(["success" => false, "message" => "Password must contain at least one number."]);
    exit;
}
if (!preg_match('/[@$!%*?&]/', $password)) {
    echo json_encode(["success" => false, "message" => "Password must contain at least one special character."]);
    exit;
}
if (strlen($password) < 8) {
    echo json_encode(["success" => false, "message" => "Password must be at least 8 characters long."]);
    exit;
}

// Check for existing user
$stmt = $conn->prepare("SELECT * FROM user WHERE username = ? OR phone = ?");
$stmt->bind_param("ss", $username, $phone);
$stmt->execute();
$result = $stmt->get_result();  

if (mysqli_num_rows($result) > 0) {
    echo json_encode(["success" => false, "message" => "Username or phone already exists."]);
    exit;
}

// Insert user into database (storing password as plain text)
$stmt = $conn->prepare("INSERT INTO user (username, phone, password) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $username, $phone, $password);
if ($stmt->execute()) {
    $user_id = $stmt->insert_id; // Retrieve the auto-generated user_id

    // Store user in login_logs immediately after signing up
    $stmt = $conn->prepare("INSERT INTO login_logs (user_id, username, login_time) VALUES (?, ?, NOW())");
    $stmt->bind_param("is", $user_id, $username);
    if($stmt->execute()) {
        //$user_id = $stmt->insert_id; // Retrieve the auto-generated user_id

        /*$stmt2 = $conn->prepare("INSERT INTO user_profiles (username) VALUES (?)");
        $stmt2->bind_param("s", $username);
        $stmt2->execute();
        $stmt2->close();*/

        // **Initialize empty cart for new user**
        $stmt = $conn->prepare("DELETE FROM cart WHERE user_id = ?");
        $stmt->bind_param("i", $user_id);
        $stmt->execute();
        $stmt->close();


        
        $_SESSION["username"] =  $username; // Set session variable for logged-in user
        $_SESSION["user_id"] = $user_id; // Set session variable for user ID
        
        echo json_encode([
          "success" => true,
          "message" => "Signup successful.",
          "redirect" => "homepage.html"
        ]);
    }   
} else {
    echo json_encode(["success" => false, "message" => "Database insertion failed."]);
    error_log("Error: " . mysqli_error($conn));
}

mysqli_close($conn);
?>