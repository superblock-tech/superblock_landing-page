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

                <div>
                    <div class="row align-items-start">
                        <div class="col">
                            <h5>Total USDT Amount Raised: <span class="font-bold">{{$usdtAmount}}</span></h5>
                        </div>
                        <div class="col">
                            <h5>Total $SBX Tokens Sold: <span class="font-bold">{{$sbxAmount}}</span></h5>
                        </div>
                        <div class="col">
                            <h5>Total Holders: <span class="font-bold">{{$transactionsCount}}</span></h5>
                        </div>
                    </div>

                </div>

                <nav>
                    <ul class="nav nav-tabs">
                        <li class="nav-item">
                            <a class="nav-link active" href="{{ route('presale_transactions.list') }}">View Transactions</a>
                        </li>
                        <li class="nav-item">
                            <!-- Trigger Add Transaction modal -->
                            <a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#addTransactionModal">Add Transaction</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#importModal">Import Transactions</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('presale_transactions.export') }}">Export Transactions</a>
                        </li>
                    </ul>
                </nav>

                <div class="mt-3">
                    <h3>Transaction List</h3>
                    <table class="table table-bordered">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>System Wallet</th>
                            <th>Wallet Address</th>
                            <th>Crypto Amount</th>
                            <th>Crypto</th>
                            <th>Crypto Network</th>
                            <th>USDT Amount</th>
                            <th>$SBX Price</th>
                            <th>$SBX tokens Allocated</th>
                            <th>Transaction Confirmation</th>
                            <th>Date/Time</th>
                            <th>TXN ID</th>
                        </tr>
                        </thead>
                        <tbody>
                        @forelse($transactions as $transaction)
                            <tr>
                                <td>{{ $transaction->id }}</td>
                                <td>{{ $transaction->system_wallet }}</td>
                                <td>{{ $transaction->wallet_address }}</td>
                                <td>{{ $transaction->amount }}</td>
                                <td>{{ $transaction->crypto?->name }}</td>
                                <td>{{ $transaction->cryptoNetwork?->name }}</td>
                                <td>{{ $transaction->usdt_amount }}</td>
                                <td>{{ $transaction->usdt_amount / $transaction->sbx_price }}</td>
                                <td>{{ $transaction->tokens_allocated }}</td>
                                <td>{{ $transaction->transaction_confirmation }}</td>
                                <td>{{ $transaction->created_at }}</td>
                                <td>{{ $transaction->txn_id }}</td>
                                <td>
                                    @if(!$transaction->txn_id)
                                        <button class="btn btn-sm btn-primary mb-2" data-bs-toggle="modal" data-bs-target="#confirmTransactionModal" data-transaction-id="{{ $transaction->id }}">
                                        Confirm
                                        </button>
                                    @endif
                                    <button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteTransactionModal" data-transaction-id="{{ $transaction->id }}">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5">No transactions available.</td>
                            </tr>
                        @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Transaction Modal -->
    <div class="modal fade" id="addTransactionModal" tabindex="-1" aria-labelledby="addTransactionModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addTransactionModalLabel">Add New Transaction</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form action="{{ route('presale_transactions.store') }}" method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="wallet_address" class="form-label">Transaction Wallet Address</label>
                            <input type="text" name="wallet_address" id="wallet_address" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="amount" class="form-label">Transaction Amount</label>
                            <input type="text" name="amount" id="amount" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="crypto_id" class="form-label">Transaction Crypto Currency</label>
                            <select type="text" name="crypto_id" id="crypto_id" class="form-control" required>
                                @foreach($crypto as $item)
                                    <option value="{{$item->id}}">{{$item->name}}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="crypto_network_id" class="form-label">Transaction Crypto Network</label>
                            <select type="text" name="crypto_network_id" id="crypto_network_id" class="form-control" required>
                                @foreach($cryptoNetwork as $item)
                                    <option value="{{$item->id}}">{{$item->name}}</option>
                                @endforeach
                            </select>
                        </div>
                        <div class="mb-3">
                            <label for="usdt_amount" class="form-label">Transaction USDT Amount</label>
                            <input type="text" name="usdt_amount" id="usdt_amount" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="sbx_price" class="form-label">Transaction SBX Price</label>
                            <input type="text" name="sbx_price" id="sbx_price" class="form-control" required>
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

    <!-- Delete Transaction Modal -->
    <div class="modal fade" id="deleteTransactionModal" tabindex="-1" aria-labelledby="deleteTransactionModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteTransactionModalLabel">Delete Transaction</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form id="deleteTransactionForm" method="POST">
                    @csrf
                    @method('DELETE')
                    <div class="modal-body">
                        Are you sure you want to delete the transaction <span id="transactionToDelete"></span>?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-danger">Delete</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
    <div class="modal fade"  id="importModal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Import</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="importForm" action="{{ route('presale_transactions.import') }}" method="POST" enctype="multipart/form-data">
                        @csrf
                        <input type="file" id="fileInput" name="file">
                        <button type="submit" class="btn btn-primary">Import</button>
                    </form>

                </div>
            </div>
        </div>
        <div class="tab-pane fade show active">
        </div>
    </div>
    <div class="modal fade" id="confirmTransactionModal" tabindex="-1" aria-labelledby="confirmTransactionModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addTransactionModalLabel">Confirm Transaction</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form method="POST" enctype="multipart/form-data">
                    @csrf
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="transaction_confirmation" class="form-label">Transaction Confirmation Message</label>
                            <input type="text" name="transaction_confirmation" id="transaction_confirmation" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="txn_id" class="form-label">Transaction TXN ID</label>
                            <input type="text" name="txn_id" id="txn_id" class="form-control" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Confirm</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    <script>
        const deleteTransactionModal = document.getElementById('deleteTransactionModal');
        deleteTransactionModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const transactionId = button.getAttribute('data-transaction-id');
            const transactionName = button.getAttribute('data-transaction-name');
            document.getElementById('transactionToDelete').textContent = transactionName;

            const form = deleteTransactionModal.querySelector('form');
            form.action = '/presale-transactions/' + transactionId;
        });


        const confirmTransactionModal = document.getElementById('confirmTransactionModal');
        confirmTransactionModal.addEventListener('show.bs.modal', function(event) {
            const button = event.relatedTarget;
            const transactionId = button.getAttribute('data-transaction-id');
            const form = confirmTransactionModal.querySelector('form');
            form.action = '/presale-transactions/' + transactionId + '/confirm';
        });
    </script>
@endsection
