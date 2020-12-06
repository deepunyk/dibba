<?php
require 'config.php';
$userId = $_POST["user_id"];
$sql = "SELECT * FROM files f, userfiles uf where f.file_id = uf.file_id and uf.user_id = $userId and f.isTrash = 0 and f.file_type != 'folder' order by f.updated_at desc";
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
