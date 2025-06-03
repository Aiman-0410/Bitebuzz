<?php
session_start();
include 'conf.php'; 
header('Content-Type: application/json');

if (!isset($_SESSION["username"])) {
    echo json_encode(["message" => "User not logged in"]);
    exit();
}

$username = $_SESSION["username"];

// ** Fetch User Profile ** //
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $stmt = $conn->prepare("SELECT username, email, phone, address, avatar FROM user_profiles WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();
    $profileData = $result->fetch_assoc();
    $stmt->close();

    // ** Create default profile if user does not have one **
    if (!$profileData) {
        $stmt = $conn->prepare("INSERT INTO user_profiles (username, email, phone, address, avatar) VALUES (?, '', '', '', 'images1/avatar1.jpeg')");
        $stmt->bind_param("s", $username);
        $stmt->execute();
        $stmt->close();
        
        $profileData = ["username" => $username, "email" => "", "phone" => "", "address" => "", "avatar" => "images1/avatar1.jpeg"];
    }

    echo json_encode($profileData);
}

// ** Update User Profile ** //
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data["email"], $data["phone"], $data["address"], $data["avatar"])) {
        echo json_encode(["message" => "Missing required fields"]);
        exit();
    }

    $email = $data["email"];
    $phone = $data["phone"];
    $address = $data["address"];
    $avatar = $data["avatar"];

    // ** Update profile in database **
    $stmt = $conn->prepare("INSERT INTO user_profiles (username, email, phone, address, avatar) 
        VALUES (?, ?, ?, ?, ?) 
        ON DUPLICATE KEY UPDATE email = VALUES(email), phone = VALUES(phone), address = VALUES(address), avatar = VALUES(avatar)");

    $stmt->bind_param("sssss", $username, $email, $phone, $address, $avatar);

    if ($stmt->execute()) {
        $_SESSION["user_profile"] = ["username" => $username, "email" => $email, "phone" => $phone, "address" => $address, "avatar" => $avatar];
        echo json_encode(["message" => "👍 Profile updated successfully"]);
    } else {
        echo json_encode(["message" => "Update failed: " . $stmt->error]);
    }

    $stmt->close();
}

$conn->close();
?>