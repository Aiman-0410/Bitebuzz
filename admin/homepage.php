<?php
session_start();
if (!isset($_SESSION['isLoggedIn']) || $_SESSION['isLoggedIn'] !== true) {
    header("Location: login.php");
    exit();
}
?>

<!DOCTYPE html>
<html>
<head>
  <title>Admin Homepage</title>
</head>
<body>
  <h2>Welcome, <?php echo $_SESSION['username']; ?>!</h2>
  <p>This is the admin dashboard.</p>
  <a href="logout.php">Logout</a>
</body>
</html>