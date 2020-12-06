<?php

$fileId = $_POST['file_id'];
$starVal = $_POST['star_val'];

require 'config.php';
$sql = "update files set isStarred = $starVal where file_id = $fileId";
$result = $db->query($sql);

if ($result) {
        echo "1";
    
} else {
    echo "0";
}
$db->close();
?>