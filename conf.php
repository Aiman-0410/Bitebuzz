<?php
// Database connection
$servername = "localhost"; // The database host, typically 'localhost' for local development
$username = "root";        // The database username (for MySQL, this is usually 'root' on local machines)
$password = "";            // The database password (empty by default for local MySQL installations)
$dbname = "bitebuzz";      // The name of the database you're connecting to

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed"])); // If the connection fails, the script will die and show an error message
}
?>