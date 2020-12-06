<?php

$fileId = $_POST['file_id'];
$trashValue = $_POST['trash_value'];

require 'config.php';
$sql = "update files set isTrash = $trashValue, isStarred = 0 where file_id = $fileId";
$result = $db->query($sql);

if ($result) {
        echo "1";
    
} else {
    echo "0 results";
}
$db->close();
?>