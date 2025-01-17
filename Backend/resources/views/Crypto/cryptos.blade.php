@extends('Layouts.main')

@section('content')
    <div class="container mt-4">
        <div class="row">
            <div class="col-md-12">
                <nav>
                    @if (session('success'))
                        <div class="alert alert-success">
                            {{ session('success') }}
                        </div>
                    @elseif (session('error'))
                        <div class="alert alert-danger">
                            {{ session('error') }}
                        </div>
                    @endif
                    <ul class="nav nav-tabs">
                        <li class="nav-item">
                            <a class="nav-link active" href="">View Cryptos</a>
                        </li>
                    </ul>
                </nav>

                <div class="mt-3">
                    <h3>Crypto List</h3>
                    <table class="table table-bordered">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Symbol</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        @forelse($cryptos as $crypto)
                            <tr>
                                <td>{{ $crypto->id }}</td>
                                <td>{{ $crypto->name }}</td>
                                <td>
                                    @if($crypto->symbol == 'BTC')
                                        <div style="width: 60px;">
                                            <img class="logo" src="CryptoIcons/BTC.jpg" style="width: 100%">
                                        </div>
                                    @elseif($crypto->symbol == 'ETH')
                                        <div style="width: 60px;">
                                            <img class="logo" src="CryptoIcons/ETH.jpg" style="width: 100%">
                                        </div>
                                    @elseif($crypto->symbol == 'SOL')
                                        <div style="width: 60px;">
                                            <img class="logo" src="CryptoIcons/SOL.jpg" style="width: 100%">
                                        </div>
                                    @elseif($crypto->symbol == 'BNB')
                                        <div style="width: 60px;">
                                            <img class="logo" src="CryptoIcons/BNB.jpg" style="width: 100%">
                                        </div>
                                    @elseif($crypto->symbol == 'USDT')
                                        <div style="width: 60px;">
                                            <img class="logo" src="CryptoIcons/USDT.jpg" style="width: 100%">
                                        </div>
                                    @endif
                                </td>
                                <td>
                                    {{ $crypto->price }}
                                    <span style="font-size: 0.85rem; color: #6c757d; font-weight: bold;">USD</span>
                                </td>
                                <td>
                                    <!-- Edit Button -->
                                    <button
                                        class="btn btn-sm btn-warning"
                                        data-bs-toggle="modal"
                                        data-bs-target="#editPriceModal"
                                        data-id="{{ $crypto->id }}"
                                        data-name="{{ $crypto->name }}"
                                        data-price="{{ $crypto->price }}">
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5">No cryptos available.</td>
                            </tr>
                        @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Edit Price Modal -->
    <div class="modal fade" id="editPriceModal" tabindex="-1" aria-labelledby="editPriceModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form id="edit-price-form" method="POST" action="">
                    @csrf
                    @method('PUT')
                    <input type="hidden" name="id" id="crypto-id">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editPriceModalLabel">Edit Crypto Price</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="crypto-name" class="form-label">Crypto Name</label>
                            <input type="text" class="form-control" id="crypto-name" readonly>
                        </div>
                        <div class="mb-3">
                            <label for="crypto-price" class="form-label">Price</label>
                            <input type="number" step="0.01" class="form-control" name="price" id="crypto-price" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary">Save Changes</button>
                    </div>
                </form>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function () {
            const editButtons = document.querySelectorAll('button[data-bs-target="#editPriceModal"]');
            const editForm = document.getElementById('edit-price-form');

            editButtons.forEach(button => {
                button.addEventListener('click', function () {
                    const cryptoId = this.getAttribute('data-id');
                    const cryptoName = this.getAttribute('data-name');
                    const cryptoPrice = this.getAttribute('data-price');

                    // Set values in the modal
                    document.getElementById('crypto-id').value = cryptoId;
                    document.getElementById('crypto-name').value = cryptoName;
                    document.getElementById('crypto-price').value = cryptoPrice;

                    // Update the form action dynamically
                    editForm.setAttribute('action', `/cryptos/${cryptoId}`);
                });
            });
        });
    </script>
@endsection
