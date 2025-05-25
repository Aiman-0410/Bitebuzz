<?php
include 'conf.php'; // your database connection
$users = mysqli_query($conn, "SELECT COUNT(*) AS total FROM user");
$orders = mysqli_query($conn, "SELECT COUNT(*) AS total FROM orders");
$menu = mysqli_query($conn, "SELECT COUNT(*) AS total FROM menu");

$data = [
  "usersCount" => mysqli_fetch_assoc($users)['total'],
  "ordersCount" => mysqli_fetch_assoc($orders)['total'],
  "menuCount" => mysqli_fetch_assoc($menu)['total']
];

echo json_encode($data);
?>