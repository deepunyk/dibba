<?php
require 'config.php';
$userId = $_POST["user_id"];
$sql = "SELECT * FROM files f, sharedfiles sf where f.file_id = sf.file_id and sf.user_id = $userId";
$result = $db->query($sql);
$rows = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $rows[] = $row;
    }
    echo json_encode($rows);
} else {
    echo "0";
}
$db->close();
?>
