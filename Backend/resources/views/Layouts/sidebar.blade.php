<div class="sidebar">
    <div class="sidebar-header">
        <img class="logo" src="Logo/logo.png" style="width: 100%">
    </div>
    <ul class="nav flex-column">
        <li class="nav-item">
            <a class="nav-link active" href="{{ route("dashboard") }}">
                Generate Codes
            </a>
        </li>
        <li class="nav-item ">
            <a class="nav-link" href="{{ route('walletAddress') }}">
                Wallet Address
            </a>
        </li>
        <li class="nav-item ">
            <a class="nav-link" href="{{ route('contactForm') }}">
                Contact Form
            </a>
        </li>
        <li class="nav-item ">
            <a class="nav-link" href="{{ route("logout") }}">
                Logout
            </a>
        </li>
    </ul>
</div>