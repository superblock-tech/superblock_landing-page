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
                            <a class="nav-link active" href="">View Details</a>
                        </li>
                    </ul>
                </nav>

                <div class="mt-3">
                    <h3>Details</h3>
                    <table class="table table-bordered">
                        <thead>
                        <tr>
                            <th>USDT Raised</th>
                            <th>Holders</th>
                            <th>SBX Price</th>
                            <th>Total Tokens</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        @if($whiteListContent)
                        <tr>
                            <td>{{ number_format($whiteListContent['usdtRaised'], 3) }} USD</td>
                            <td>{{ $whiteListContent['holders'] }}</td>
                            <td>{{ number_format($whiteListContent['sbxPrice'], 9) }}</td>
                            <td>{{ number_format($whiteListContent['totalTokens'], 2) }}</td>
                            <td>
                                <!-- Edit Button -->
                                <button
                                    class="btn btn-sm btn-warning"
                                    data-bs-toggle="modal"
                                    data-bs-target="#editPriceModal"
                                    data-id="{{ $whiteListContent['id'] }}"
                                    data-usdtraised="{{ $whiteListContent['usdtRaised'] }}"
                                    data-holders="{{ $whiteListContent['holders'] }}"
                                    data-sbxprice="{{ $whiteListContent['sbxPrice'] }}"
                                    data-totaltokens="{{ $whiteListContent['totalTokens'] }}">
                                    Edit
                                </button>
                            </td>
                        </tr>
                        @else
                        <tr>
                            <td colspan="5" class="text-center text-muted py-4">No whitelist record found. Please run the database seeder: <code>php artisan db:seed --class=WhitelistSeeder</code></td>
                        </tr>
                        @endif
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
                        <h5 class="modal-title" id="editPriceModalLabel">Edit Details</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="usdtRaised" class="form-label">USDT Raised</label>
                            <input type="number" step="0.00000001" class="form-control" name="usdtRaised" id="usdtRaised" required>
                        </div>
                        <div class="mb-3">
                            <label for="holders" class="form-label">Holders</label>
                            <input type="number" class="form-control" name="holders" id="holders" required>
                        </div>
                        <div class="mb-3">
                            <label for="sbxPrice" class="form-label">SBX Price</label>
                            <input type="number" step="0.00000001" class="form-control" name="sbxPrice" id="sbxPrice" required>
                        </div>
                        <div class="mb-3">
                            <label for="totalTokens" class="form-label">Total Tokens</label>
                            <input type="number" step="0.00000001" class="form-control" name="totalTokens" id="totalTokens" required>
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
                    const whiteListId = this.getAttribute('data-id');
                    const usdtRaised = this.getAttribute('data-usdtraised');
                    const holders = this.getAttribute('data-holders');
                    const sbxPrice = this.getAttribute('data-sbxprice');
                    const totalTokens = this.getAttribute('data-totaltokens');

                    // Set values in the modal
                    document.getElementById('crypto-id').value = whiteListId;
                    document.getElementById('usdtRaised').value = usdtRaised;
                    document.getElementById('holders').value = holders;
                    document.getElementById('sbxPrice').value = sbxPrice;
                    document.getElementById('totalTokens').value = totalTokens;

                    // Update the form action dynamically
                    editForm.setAttribute('action', `/whitelist/${whiteListId}`);
                });
            });
        });
    </script>
@endsection
