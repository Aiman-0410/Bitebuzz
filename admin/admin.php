<?php
session_start();
if (!isset($_SESSION['admin'])) {
    header("Location: login.html");
    exit();
}
?>

<!DOCTYPE html>
<html>
<head>
  <title>Admin Dashboard</title>
</head>
<body>
  <h2>Welcome, <?php echo $_SESSION['admin']; ?>!</h2>
  <p>This is the admin dashboard.</p>

  <a href="logout.php">Logout</a>
</body>
</html>