<?php
    include("config.php");

                    $username = $_POST['uname'];
                    $password = $_POST['password'];

                    $sql = "SELECT * FROM user WHERE username = '$username' and password = '$password'";
                    $result = $db->query($sql);
                    $rows = array();
                    $count = mysqli_num_rows($result);
                    if ($result->num_rows > 0) {
                        while ($row = $result->fetch_assoc()) {
                            echo $row['user_id'];
                        }
                    } else {
                        echo "0";
                    }
?>