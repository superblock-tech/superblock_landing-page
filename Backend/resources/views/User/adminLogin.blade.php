<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>SignIn&SignUp</title>
    <link rel="stylesheet" type="text/css" href="./style.css" />
    <link rel="stylesheet" href="/style.css">
</head>

<body>
<div class="container">
    <div class="forms-container">
        <div class="signin-signup">
            <form action="{{ route('adminLogin') }}" method="POST" class="sign-in-form">
                @csrf
                <h2 class="title">Sign In</h2>

                <!-- Display error message -->
                @if(session('error'))
                    <div class="alert" style="color: red; font-size: 14px; margin-bottom: 10px;">
                        {{ session('error') }}
                    </div>
                @endif

                <input type="email" placeholder="Username" name="email" value="{{ old('email') }}" />
                <input type="password" placeholder="Password" name="password" />
                <input type="submit" value="Login" class="btn solid" />
            </form>
        </div>
    </div>
    <div class="panels-container">

        <div class="panel central-panel">
            <div class="content">
                <img class="logo" src="Logo/logo.png" style="width: 100%">
                <p>Welcome to the The Superblock Ecosystem powered by advanced technology that ensures security, efficiency, and scalability across all its services.
                </p>
            </div>
        </div>
    </div>
</div>

</body>

</html>
