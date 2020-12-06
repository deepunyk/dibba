<?php
require 'config.php';
$userId = $_POST["user_id"];
$sql = "SELECT sum(f.size) as size FROM files f, userfiles uf where f.file_id = uf.file_id and uf.user_id = $userId and f.isTrash = 0";
$result = $db->query($sql);
$rows = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        echo $row['size'];
    }
} else {
    echo "0";
}
$db->close();
?>
