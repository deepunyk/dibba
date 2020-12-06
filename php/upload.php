<?php

$fileName = $_FILES['file']['name'];
$fileType = $_FILES['file']['type'];
$fileSize = $_FILES['file']['size'];
$updatedAt = date('Y-m-d H:i:s');
$fileUrl = $_POST['url'];
$userId = $_POST['user_id'];

$uploadLocation = "D:/Softwares/Xamp/htdocs/Web/cloud/$fileUrl/$fileName";

if ( move_uploaded_file($_FILES['file']['tmp_name'], $uploadLocation) ) { 
    require 'config.php';
    $sql = "insert into files(file_name, file_type, file_url, updated_at, size, isTrash) values('$fileName','$fileType','$fileUrl','$updatedAt','$fileSize',0)";
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
} else { 
  echo '2'; 
}

?>