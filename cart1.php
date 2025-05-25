<?php
session_start();

error_reporting(E_ALL);
ini_set('display_errors', 1);

include "conf.php";
header('Content-Type: application/json');
error_reporting(0); 

if (ob_get_level()) ob_clean();

//$data = json_decode(trim(file_get_contents("php://input")), true);
//file_put_contents("log.txt", print_r($data, true)); // Logs data for debugging
$rawData = file_get_contents("php://input");
file_put_contents("debug_log.txt", $rawData); // Logs raw input for debugging

$data = json_decode(trim($rawData), true);
file_put_contents("parsed_data_log.txt", print_r($data, true)); // Logs parsed JSON data
if (empty($data)) {
    die(json_encode(["status" => "error", "message" => "No data received, check debug_log.txt"]));
}

// Ensure user is logged in
if (!isset($_SESSION["user_id"])) {
    echo json_encode(["message" => "User not logged in"]);
    exit();
}

file_put_contents("session_debug.txt", print_r($_SESSION, true));
$user_id = $_SESSION["user_id"];


foreach ($data as $item) {  
    if (!isset($item['name'], $item['price'], $item['quantity'])) {
        die(json_encode(["status" => "error", "message" => "Missing required fields: " . json_encode($item)]));
    }

    $item_name = $conn->real_escape_string($item['name']);
    $quantity = intval($item['quantity']);

    // Fetch menu_id, restaurant_id, and price dynamically from menu table
    $sql = "SELECT menu_id, restaurant_id, price FROM menu WHERE item_name = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $item_name);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($row = $result->fetch_assoc()) {
        $menu_id = $row["menu_id"];
        $restaurant_id = $row["restaurant_id"];
        $price = floatval($row["price"]);
        $total_price = $price * $quantity;

        // Insert into cart table
        $insert_sql = "INSERT INTO cart (user_id, menu_id, restaurant_id, item_name, quantity, price, total_price) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity), total_price = quantity * price";
;
        $insert_stmt = $conn->prepare($insert_sql);
        $insert_stmt->bind_param("iiisidd", $user_id, $menu_id, $restaurant_id, $item_name, $quantity, $price, $total_price);

        if (!$insert_stmt->execute()) {
            die(json_encode(["status" => "error", "message" => "Failed to insert item: " . $insert_stmt->error]));
        }

        $insert_stmt->close();
    } else {
        die(json_encode(["status" => "error", "message" => "Item not found in menu table"]));
    }

    $stmt->close();
}

echo json_encode(["status" => "success", "message" => "Cart items saved successfully"]);
exit();
$conn->close();
?>