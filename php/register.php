<?php

include("config.php");


        $username = $_POST['uname'];
        $password = $_POST['password'];
        $cpassword = $_POST['cpassword'];
        $email = $_POST['email'];

        if (strcmp($password,$cpassword)== 0) {

            $sql = "insert into user (username, password, email) values ('$username', '$password', '$email')";
            $result = mysqli_query($db, $sql);
            if ($result) {
                $userId = $db->insert_id;
                mkdir("../cloud/$userId");
                echo "1";
            } else {
                echo "2";

            }
        } else {
            echo "2";
        }
    

?>