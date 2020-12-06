<?php

$userName = $_POST['user_name'];
$fileId = $_POST['file_id'];


require 'config.php';

$sql = "select * from user where username = '$userName'";

$result = $db->query($sql);

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $userId = $row['user_id'];
    $sql = "insert into sharedfiles(file_id, user_id) values($fileId,$userId)";
    $result = $db->query($sql);
    if ($result) {
        echo "1";
    }
    }
} else {
    echo "0";
}
$db->close();
?>