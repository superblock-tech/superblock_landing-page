<!doctype html>
<html lang="en">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, user-scalable=no">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Admin Panel</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65" crossorigin="anonymous">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css">
    <link rel="stylesheet" href="styleAdminPanel.css">
    @yield('style')
</head>

<body>
<div class="d-flex mainContainer">
    <div class="sideBar">
        @include('Layouts.sidebar')
    </div>

    <div class="content">
        <!-- Hamburger icon visible only on small and medium screens -->
        <button class="hamburger-btn d-block d-md-none">
            <i id="hamburgerIcon" class="fa-solid fa-bars"></i>
        </button>
        @yield('content')
    </div>
</div>

<script src="https://unpkg.com/sweetalert/dist/sweetalert.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4" crossorigin="anonymous"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.0/jquery.min.js"></script>

@yield('scripts')

<!-- Add the toggle functionality script -->
<script>
    $(document).ready(function() {
        $('.hamburger-btn').click(function() {
            $('.sideBar').toggleClass('active');
        });
    });
</script>
</body>

</html>
