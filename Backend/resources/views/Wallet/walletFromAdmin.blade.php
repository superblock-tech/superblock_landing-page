@extends('Layouts.main')

@section('content')
    <div class="container mt-4">
        <div class="row">
            <div class="col-md-12">
                <!-- Flash Messages -->
                @if(session('success'))
                    <div class="alert alert-success alert-dismissible fade show" role="alert">
                        {{ session('success') }}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                @endif

                @if(session('error'))
                    <div class="alert alert-danger alert-dismissible fade show" role="alert">
                        {{ session('error') }}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                @endif

                <nav>
                    <ul class="nav nav-tabs">
                        <li class="nav-item">
                            <a class="nav-link active" href="{{ route('walletAddress') }}">View Wallets</a>
                        </li>
                        <li class="nav-item">
                            <!-- Trigger Add Wallet modal -->
                            <a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#addWalletModal">Add Wallet</a>
                        </li>
                    </ul>
                </nav>

                <div class="mt-3">
                    <h3>Wallet List</h3>
                    <table class="table table-bordered">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Icon</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        @forelse($wallets as $wallet)
                            <tr>
                                <td>{{ $wallet->id }}</td>
                                <td>{{ $wallet->name }}</td>
                                <td>{{ $wallet->address }}</td>
                                <td>
                                    @if($wallet->icon)
                                        <img src="{{ asset('storage/' . $wallet->icon) }}" alt="Icon" width="50">
                                    @else
                                        No icon
                                    @endif
                                </td>
                                <td>
                                    <!-- Trigger Delete Wallet modal -->
                                    <button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteWalletModal" data-wallet-id="{{ $wallet->id }}">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5">No wallets available.</td>
                            </tr>
                        @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Wallet Modal -->
    <div class="modal fade" id="addWalletModal" tabindex="-1" aria-labelledby="addWalletModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addWalletModalLabel">Add New Wallet</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form action="{{ route('wallets.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="name" class="form-label">Wallet Name</label>
                            <input type="text" name="name" id="name" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="address" class="form-label">Wallet Address</label>
                            <input type="text" name="address" id="address" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="icon" class="form-label">Wallet Icon (optional)</label>
                            <input type="file" name="icon" id="icon" class="form-control">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Save</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <!-- Delete Wallet Modal -->
    <div class="modal fade" id="deleteWalletModal" tabindex="-1" aria-labelledby="deleteWalletModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteWalletModalLabel">Delete Wallet</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="deleteWalletForm" method="POST">
                    @csrf
                    @method('DELETE')
                    <div class="modal-body">
                        Are you sure you want to delete the wallet <span id="walletToDelete"></span>?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-danger">Delete</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    <script>
        const deleteWalletModal = document.getElementById('deleteWalletModal');
        deleteWalletModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget; // Button that triggered the modal
            const walletId = button.getAttribute('data-wallet-id'); // Extract wallet ID
            const walletName = button.getAttribute('data-wallet-name'); // Extract wallet Name

            // Update the modal content to show which wallet is being deleted
            document.getElementById('walletToDelete').textContent = walletName;

            // Dynamically set the form's action URL with the correct walletId
            const form = deleteWalletModal.querySelector('form');
            form.action = '/wallets/' + walletId; // Set the form's action to /wallets/{walletId}
        });
    </script>
@endsection
