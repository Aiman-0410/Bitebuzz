<?php
include 'conf.php';
$result = mysqli_query($conn, "SELECT o.id, u.username AS user, m.name AS item, o.status 
  FROM orders o 
  JOIN users u ON o.user_id = u.id 
  JOIN menu m ON o.menu_id = m.id");

$orders = [];
while ($row = mysqli_fetch_assoc($result)) {
  $orders[] = $row;
}
echo json_encode($orders);
?>