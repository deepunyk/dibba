<!DOCTYPE html>

<html>

<head>
    <meta charset="utf-8">
    <title>DIBBA</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="css/login.css" rel="stylesheet" type="text/css" />
    <script>
        function loginUser() {


            var formData = new FormData();
            formData.append("uname", document.getElementById("uname").value);
            formData.append("password", document.getElementById("password").value);

            var xhttp = new XMLHttpRequest();

            xhttp.open("POST", "http://127.0.0.1/web/php/login.php", true);

            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {

                    alert(this.responseText);
                }
            };

            xhttp.send(formData);
        }
    </script>

</head>

<body>
    <div class="login-section">
        <h1>
            Login
        </h1>
        <input type="text" id="uname" placeholder="User Name" required>
        <input type="password" id="password" placeholder="Password" required>
        <input type="button" id="login" value="Login" onclick="loginUser()">
        <div class="register-section">
            <p>Do not have an account?&nbsp;</p><a href="register.php">
                <p>Register now</p>
            </a>
        </div>
    </div>

</body>

</html>