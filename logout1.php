<?php
session_start();
include 'conf.php'; // Ensure database connection is established

if(isset($_SESSION['username'])) { // Assume the session holds the username
    $username = $_SESSION['username'];
    $logged_out_time = date("Y-m-d H:i:s");

    // Retrieve the user_id from the users table
    $stmt = $conn->prepare("SELECT user_id FROM user WHERE username = ?");
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        $user_id = $row['user_id'];

        // Store logout details in the logout table
        $stmt = $conn->prepare("INSERT INTO logout (user_id, logged_out_time) VALUES (?, ?)");
        $stmt->bind_param("is", $user_id, $logged_out_time);

        if ($stmt->execute()) {
            session_destroy(); // End session
            echo json_encode(["success" => true]);
        } else {
            echo json_encode(["success" => false, "error" => $stmt->error]);
        }

    } else {
        echo json_encode(["success" => false, "error" => "User not found"]);
    }

    $stmt->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "error" => "No active session"]);
}
?>