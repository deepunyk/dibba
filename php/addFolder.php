<?php

$updatedAt = date('Y-m-d H:i:s');
$fileUrl = $_POST['url'];
$userId = $_POST['user_id'];
$folderName = $_POST['folder_name'];


require 'config.php';
mkdir("../cloud/$fileUrl/$folderName");
$sql = "insert into files(file_name, file_type, file_url, updated_at, size, isTrash) values('$folderName','folder','$fileUrl','$updatedAt',0,0)";
$result = $db->query($sql);

if ($result) {
    $fileId = $db->insert_id;
    $sql = "insert into userFiles(file_id, user_id) values($fileId,$userId)";
    $result = $db->query($sql);
    if ($result) {
        echo "1";
    }
} else {
    echo "0";
}
$db->close();
?>