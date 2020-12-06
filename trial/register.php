<!DOCTYPE html>

<html>

<head>
    <meta charset="utf-8">
    <title>DIBBA</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="css/register.css" rel="stylesheet" type="text/css" />
    <?php
    include("php/config.php");

    if ($_SERVER["REQUEST_METHOD"] == "POST") {

        $username = mysqli_real_escape_string($db, $_POST['uname']);
        $password = mysqli_real_escape_string($db, $_POST['password']);
        $cpassword = mysqli_real_escape_string($db, $_POST['cpassword']);
        $email = mysqli_real_escape_string($db, $_POST['email']);

        if ($password == $cpassword) {

            $sql = "insert into user (username, password, email) values ('$username', '$password', '$email')";
            $result = mysqli_query($db, $sql);
            if ($result) {
                //header("location: welcome.php");
            } else {
                echo "<script type='text/javascript'>alert('This username is already taken');</script>";

            }
        } else {
            echo "<script type='text/javascript'>alert('Passwords dont match');</script>";
        }
    }
    ?>
</head>

<body>
    <form action="" method="post">
        <div class="login-section">
            <h1>
                Register
            </h1>
            <input type="email" name="email" placeholder="Email" required>
            <input type="text" name="uname" placeholder="User Name" required>
            <input type="password" name="password" placeholder="Password" required>
            <input type="password" name="cpassword" placeholder="Confirm Password" required>
            <input type="submit" name="register" value="Register">
            <div class="register-section">
                <p>Already have an account?&nbsp;</p><a href="login.php">
                    <p>Login</p>
                </a>
            </div>
        </div>
        </div>
    </form>
</body>

</html>