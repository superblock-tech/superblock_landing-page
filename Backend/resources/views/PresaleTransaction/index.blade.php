@extends('Layouts.main')

@section('content')
    <div class="mt-4">
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
                            <h5>Total USDT Amount Raised: <span class="font-bold">{{ format_decimal($usdtAmount) }}</span></h5>
                        </div>
                        <div class="col">
                            <h5>Total $SBX Tokens Sold: <span class="font-bold">{{ format_decimal($sbxAmount) }}</span></h5>
                        </div>
                        <div class="col">
                            <h5>Total Holders: <span class="font-bold">{{$transactionsCount}}</span></h5>
                        </div>
                    </div>

                </div>

                <nav>
                    <ul class="nav nav-tabs" role="tablist">
                        <li class="nav-item">
                            <a class="nav-link active" id="blockchain-tab" data-bs-toggle="tab" href="#blockchain-transactions" role="tab">Blockchain Transactions</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" id="manual-tab" data-bs-toggle="tab" href="#manual-transactions" role="tab">Manual Transactions</a>
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

                <form method="GET" action="{{ route('presale_transactions.list') }}" id="networkFilterForm" class="mb-3 mt-3 p-3 border rounded bg-light">
                    <input type="hidden" name="tab" id="filterTabParam" value="{{ request('tab', 'blockchain') }}">
                    <div class="row g-3">
                        <div class="col-12">
                            <label class="form-label fw-bold">Filter by network type:</label>
                            <div class="d-flex gap-3 align-items-center flex-wrap">
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="network" id="network-all" value="all" {{ ($networkFilter ?? 'all') === 'all' ? 'checked' : '' }}>
                                    <label class="form-check-label" for="network-all">All</label>
                                </div>
                                <div class="form-check">
                                    <input class="form-check-input" type="radio" name="network" id="network-mainnet" value="mainnet" {{ ($networkFilter ?? '') === 'mainnet' ? 'checked' : '' }}>
                                    <label class="form-check-label" for="network-mainnet">Mainnet only (exclude testnet)</label>
                                </div>
                                <div class="form-check ms-2 ps-2 border-start">
                                    <input class="form-check-input" type="checkbox" name="hide_no_chain" id="hide_no_chain" value="1" {{ ($hideNoChain ?? false) ? 'checked' : '' }}>
                                    <label class="form-check-label" for="hide_no_chain">Hide without chain name</label>
                                </div>
                                <button type="button" class="btn btn-outline-danger btn-sm ms-2" id="deleteWithoutChainNameBtn" title="Permanently delete all transactions that have no chain name">
                                    Remove No chain TX from DB
                                </button>
                            </div>
                            @if(($networkFilter ?? '') === 'mainnet')
                                <div class="alert alert-info py-2 mb-0 mt-2">Testnet transactions are hidden.</div>
                            @endif
                            @if($hideNoChain ?? false)
                                <div class="alert alert-info py-2 mb-0 mt-2">Transactions without chain name are hidden.</div>
                            @endif
                        </div>
                        <div class="col-12">
                            <label class="form-label fw-bold">Filter by crypto/network (from wallets):</label>
                            <div class="d-flex gap-2 align-items-center flex-wrap">
                                <select name="crypto_id" class="form-select" style="max-width: 200px;">
                                    <option value="" {{ ($cryptoFilter ?? '') === '' ? 'selected' : '' }}>All (ETH, BTC, SOL, ...)</option>
                                    @foreach($cryptosForFilter ?? [] as $c)
                                        <option value="{{ $c->id }}" {{ (string)($cryptoFilter ?? '') === (string)$c->id ? 'selected' : '' }}>{{ $c->name }}</option>
                                    @endforeach
                                </select>
                                @if(($cryptoFilter ?? '') !== '' && ($walletsForSelectedCrypto ?? collect())->isNotEmpty())
                                    <div class="ms-3 ps-3 border-start">
                                        <span class="text-muted small">Receiving wallet(s):</span>
                                        @foreach($walletsForSelectedCrypto as $wallet)
                                            <code class="d-inline-block ms-1 small" title="{{ $wallet->address }}">{{ short_address($wallet->address) }}</code>@if(!$loop->last)<span class="text-muted">,</span> @endif
                                        @endforeach
                                    </div>
                                @elseif(($cryptoFilter ?? '') !== '')
                                    <div class="ms-3 ps-3 border-start text-muted small">No receiving wallet configured for this crypto.</div>
                                @endif
                            </div>
                        </div>
                        <div class="col-12 d-flex gap-2 align-items-center">
                            <button type="submit" class="btn btn-primary">Apply filters</button>
                            <button type="button" class="btn btn-outline-warning" id="rescanBtn" title="Select a crypto from dropdown first">
                                RESCAN
                            </button>
                            <button type="button" class="btn btn-outline-secondary" id="checkEndpointsBtn" title="Verify blockchain APIs are reachable">
                                Check Endpoints
                            </button>
                        </div>
                    </div>
                </form>

                <!-- Rescan Confirmation Modal -->
                <div class="modal fade" id="rescanModal" tabindex="-1" aria-labelledby="rescanModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-dialog-scrollable">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="rescanModalLabel">Confirm Rescan</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" id="rescanModalCloseBtn"></button>
                            </div>
                            <div class="modal-body">
                                <div id="rescanConfirmContent">
                                    <p id="rescanModalMessage">Rescan the blockchain for the selected crypto?</p>
                                    <p class="text-muted small mb-0">This will fetch transactions from the chain and sync them to the database. New on-chain transactions will be added. Manual entries will be preserved. <strong>This may take 1–2 minutes.</strong></p>
                                </div>
                                <div id="rescanProgressContent" class="d-none">
                                    <div class="d-flex align-items-center gap-2 mb-2">
                                        <div class="spinner-border spinner-border-sm text-warning" role="status"><span class="visually-hidden">Loading...</span></div>
                                        <strong>Rescanning blockchain…</strong>
                                    </div>
                                    <p class="text-muted small mb-2">Verifying transactions and syncing from chain. Please wait.</p>
                                    <pre id="rescanOutput" class="bg-dark text-light p-2 rounded small" style="max-height: 200px; overflow-y: auto; font-size: 0.75rem;"></pre>
                                </div>
                                <div id="rescanResultContent" class="d-none"></div>
                            </div>
                            <div class="modal-footer" id="rescanModalFooter">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <form id="rescanForm" action="{{ route('presale_transactions.rescan') }}" method="POST" class="d-inline">
                                    @csrf
                                    <input type="hidden" name="crypto_id" id="rescanCryptoId">
                                    <button type="submit" class="btn btn-warning" id="rescanSubmitBtn">Rescan</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Check Endpoints Modal -->
                <div class="modal fade" id="checkEndpointsModal" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title">Blockchain Endpoint Check</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                            </div>
                            <div class="modal-body">
                                <div id="checkEndpointsProgress" class="text-center py-3">
                                    <div class="spinner-border text-primary" role="status"></div>
                                    <p class="mt-2 mb-0">Checking endpoints…</p>
                                </div>
                                <div id="checkEndpointsResult" class="d-none">
                                    <table class="table table-sm">
                                        <thead><tr><th>Endpoint</th><th>Status</th><th>Details</th></tr></thead>
                                        <tbody id="checkEndpointsTable"></tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Delete without chain name confirmation modal -->
                <div class="modal fade" id="deleteWithoutChainNameModal" tabindex="-1" aria-labelledby="deleteWithoutChainNameModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                                <h5 class="modal-title" id="deleteWithoutChainNameModalLabel">Remove transactions without chain name</h5>
                                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div class="modal-body">
                                <p class="mb-0">This will <strong>permanently delete</strong> all transactions that have no chain name (null or empty) from the database. This action cannot be undone.</p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                                <form id="deleteWithoutChainNameForm" action="{{ route('presale_transactions.delete_without_chain_name') }}" method="POST" class="d-inline">
                                    @csrf
                                    <button type="submit" class="btn btn-danger">Delete from database</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="tab-content mt-3">
                    <div class="tab-pane fade show active" id="blockchain-transactions" role="tabpanel">
                        <h3>Blockchain Transaction List</h3>
                        <p class="text-muted">Transactions verified on-chain (synced from wallet addresses or manually confirmed)</p>
                        <table class="table table-bordered">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Account Wallet Address</th>
                                <th>Chain name</th>
                                <th>Transaction Wallet Address</th>
                                <th>Transaction Wallet Network</th>
                                <th>Transaction Wallet Crypto</th>
                                <th>Crypto Amount</th>
                                <th>USDT Amount</th>
                                <th>$SBX Price</th>
                                <th>$SBX tokens Allocated</th>
                                <th>System Wallet Address</th>
                                <th>Transaction Confirmation</th>
                                <th>Transaction Date/Time</th>
                                <th>Transaction ID</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            @forelse($blockchainTransactions as $transaction)
                                <tr>
                                    <td>{{ $transaction->id }}</td>
                                    <td title="{{ $transaction->account_wallet_address }}">{{ short_address($transaction->account_wallet_address) }}</td>
                                    <td>{{ $transaction->chain_name }}</td>
                                    <td title="{{ $transaction->wallet_address }}">
                                        @php $walletUrl = blockscan_address_url($transaction->wallet_address); @endphp
                                        @if($walletUrl)
                                            <a href="{{ $walletUrl }}" target="_blank" rel="noopener noreferrer">{{ short_address($transaction->wallet_address) }}</a>
                                        @else
                                            {{ short_address($transaction->wallet_address) }}
                                        @endif
                                    </td>
                                    <td>{{ $transaction->system_wallet ? $transaction->cryptoNetwork?->name : '' }}</td>
                                    <td>{{ $transaction->crypto?->name }}</td>
                                    <td>{{ format_decimal($transaction->amount) }}</td>
                                    <td>{{ format_decimal($transaction->usdt_amount) }}</td>
                                    <td>{{ format_decimal($transaction->sbx_price > 0 ? ($transaction->usdt_amount / $transaction->sbx_price) : 0) }}</td>
                                    <td>{{ format_decimal($transaction->sbx_price) }}</td>
                                    <td title="{{ $transaction->system_wallet }}">{{ short_address($transaction->system_wallet) }}</td>
                                    <td class="break-all">{{ $transaction->transaction_confirmation }}</td>
                                    <td>{{ $transaction->created_at }}</td>
                                    <td title="{{ $transaction->txn_id }}">{{ short_address($transaction->txn_id) }}</td>
                                    <td>
                                        <button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteTransactionModal" data-transaction-id="{{ $transaction->id }}">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="16">No blockchain transactions available.</td>
                                </tr>
                            @endforelse
                            </tbody>
                        </table>
                    </div>
                    <div class="tab-pane fade" id="manual-transactions" role="tabpanel">
                        <h3>Manual Transaction List</h3>
                        <p class="text-muted">Transactions added manually (not yet verified on blockchain)</p>
                        <table class="table table-bordered">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Account Wallet Address</th>
                                <th>Chain name</th>
                                <th>Transaction Wallet Address</th>
                                <th>Transaction Wallet Network</th>
                                <th>Transaction Wallet Crypto</th>
                                <th>Crypto Amount</th>
                                <th>USDT Amount</th>
                                <th>$SBX Price</th>
                                <th>$SBX tokens Allocated</th>
                                <th>System Wallet Address</th>
                                <th>Transaction Confirmation</th>
                                <th>Transaction Date/Time</th>
                                <th>Transaction ID</th>
                                <th>Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            @forelse($manualTransactions as $transaction)
                                <tr>
                                    <td>{{ $transaction->id }}</td>
                                    <td title="{{ $transaction->account_wallet_address }}">{{ short_address($transaction->account_wallet_address) }}</td>
                                    <td>{{ $transaction->chain_name }}</td>
                                    <td title="{{ $transaction->wallet_address }}">
                                        @php $walletUrl = blockscan_address_url($transaction->wallet_address); @endphp
                                        @if($walletUrl)
                                            <a href="{{ $walletUrl }}" target="_blank" rel="noopener noreferrer">{{ short_address($transaction->wallet_address) }}</a>
                                        @else
                                            {{ short_address($transaction->wallet_address) }}
                                        @endif
                                    </td>
                                    <td>{{ $transaction->system_wallet ? $transaction->cryptoNetwork?->name : '' }}</td>
                                    <td>{{ $transaction->crypto?->name }}</td>
                                    <td>{{ format_decimal($transaction->amount) }}</td>
                                    <td>{{ format_decimal($transaction->usdt_amount) }}</td>
                                    <td>{{ format_decimal($transaction->sbx_price > 0 ? ($transaction->usdt_amount / $transaction->sbx_price) : 0) }}</td>
                                    <td>{{ format_decimal($transaction->sbx_price) }}</td>
                                    <td title="{{ $transaction->system_wallet }}">{{ short_address($transaction->system_wallet) }}</td>
                                    <td class="break-all">{{ $transaction->transaction_confirmation }}</td>
                                    <td>{{ $transaction->created_at }}</td>
                                    <td title="{{ $transaction->txn_id }}">{{ short_address($transaction->txn_id) }}</td>
                                    <td>
                                        <button class="btn btn-sm btn-primary mb-2" data-bs-toggle="modal" data-bs-target="#confirmTransactionModal" data-transaction-id="{{ $transaction->id }}">
                                            Confirm
                                        </button>
                                        <button class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteTransactionModal" data-transaction-id="{{ $transaction->id }}">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            @empty
                                <tr>
                                    <td colspan="16">No manual transactions available.</td>
                                </tr>
                            @endforelse
                            </tbody>
                        </table>
                    </div>
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
                            <label for="account_wallet_address" class="form-label">Account Wallet Address</label>
                            <input type="text" name="account_wallet_address" id="account_wallet_address" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="crypto_network_id" class="form-label">Account Wallet Network</label>
                            <select type="text" name="crypto_network_id" id="crypto_network_id" class="form-control" required>
                                @foreach($cryptoNetwork as $item)
                                    <option value="{{$item->id}}">{{$item->name}}</option>
                                @endforeach
                            </select>
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
                            <label for="amount" class="form-label">Transaction Amount</label>
                            <input type="text" name="amount" id="amount" class="form-control" required>
                        </div>

                        <div class="mb-3">
                            <label for="usdt_amount" class="form-label">Transaction USDT Amount</label>
                            <input type="text" name="usdt_amount" id="usdt_amount" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="sbx_price" class="form-label">Total SBX Amount</label>
                            <input type="text" name="sbx_price" id="sbx_price" class="form-control" required readonly>
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
        const deleteWithoutChainNameBtn = document.getElementById('deleteWithoutChainNameBtn');
        const deleteWithoutChainNameModal = document.getElementById('deleteWithoutChainNameModal');
        deleteWithoutChainNameBtn?.addEventListener('click', function() {
            const modal = window.bootstrap?.Modal?.getOrCreateInstance(deleteWithoutChainNameModal);
            if (modal) modal.show();
        });

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

        function updateFilterTabParam() {
            const manualTab = document.getElementById('manual-tab');
            const param = document.getElementById('filterTabParam');
            if (param && manualTab) {
                param.value = manualTab.classList.contains('active') ? 'manual' : 'blockchain';
            }
        }
        document.getElementById('networkFilterForm')?.addEventListener('submit', function() {
            updateFilterTabParam();
        });
        document.querySelectorAll('[data-bs-toggle="tab"]').forEach(function(tabEl) {
            tabEl.addEventListener('shown.bs.tab', updateFilterTabParam);
        });
        (function() {
            const params = new URLSearchParams(window.location.search);
            if (params.get('tab') === 'manual') {
                const manualTab = document.getElementById('manual-tab');
                if (manualTab) {
                    const tab = window.bootstrap?.Tab?.getOrCreateInstance(manualTab);
                    if (tab) tab.show();
                }
            }
        })();
        document.querySelectorAll('#networkFilterForm input[name="network"]').forEach(function(radio) {
            radio.addEventListener('change', function() { document.getElementById('networkFilterForm').submit(); });
        });
        document.getElementById('hide_no_chain')?.addEventListener('change', function() {
            document.getElementById('networkFilterForm').submit();
        });
        document.querySelector('#networkFilterForm select[name="crypto_id"]')?.addEventListener('change', function() {
            document.getElementById('networkFilterForm').submit();
        });

        const rescanModal = document.getElementById('rescanModal');
        const rescanBtn = document.getElementById('rescanBtn');
        const rescanForm = document.getElementById('rescanForm');
        const cryptoSelect = document.querySelector('#networkFilterForm select[name="crypto_id"]');
        rescanBtn?.addEventListener('click', function() {
            const selectedId = cryptoSelect?.value || '';
            const selectedOption = cryptoSelect?.options[cryptoSelect?.selectedIndex];
            const cryptoName = selectedOption?.text || '';
            if (!selectedId) {
                alert('Please select a crypto/network from the dropdown first (e.g. ETH, BTC, SOL).');
                return;
            }
            document.getElementById('rescanCryptoId').value = selectedId;
            document.getElementById('rescanModalMessage').innerHTML = 'Rescan the blockchain for <strong>' + cryptoName + '</strong>?';
            document.getElementById('rescanConfirmContent').classList.remove('d-none');
            document.getElementById('rescanProgressContent').classList.add('d-none');
            document.getElementById('rescanResultContent').classList.add('d-none');
            document.getElementById('rescanModalFooter').classList.remove('d-none');
            document.getElementById('rescanOutput').textContent = '';
            const modal = window.bootstrap?.Modal?.getOrCreateInstance(rescanModal);
            if (modal) modal.show();
        });
        rescanForm?.addEventListener('submit', function(e) {
            e.preventDefault();
            const form = e.target;
            const btn = document.getElementById('rescanSubmitBtn');
            const footer = document.getElementById('rescanModalFooter');
            const outputEl = document.getElementById('rescanOutput');
            document.getElementById('rescanConfirmContent').classList.add('d-none');
            document.getElementById('rescanProgressContent').classList.remove('d-none');
            document.getElementById('rescanResultContent').classList.add('d-none');
            btn.disabled = true;
            let elapsed = 0;
            const timer = setInterval(function() {
                elapsed += 1;
                outputEl.textContent = 'Rescanning… ' + elapsed + 's elapsed. Verifying transactions and syncing from chain.';
            }, 1000);
            outputEl.textContent = 'Rescanning… 0s elapsed. Verifying transactions and syncing from chain.';
            fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'X-Requested-With': 'XMLHttpRequest', 'Accept': 'application/json' }
            }).then(function(r) { return r.json(); }).then(function(data) {
                clearInterval(timer);
                outputEl.textContent = (data.output || '').trim() || '(No output)';
                document.getElementById('rescanProgressContent').classList.add('d-none');
                const resultEl = document.getElementById('rescanResultContent');
                resultEl.classList.remove('d-none');
                resultEl.innerHTML = '<div class="alert alert-' + (data.success ? 'success' : 'danger') + ' mb-0">' + (data.message || '') + '</div>';
                footer.classList.remove('d-none');
                btn.disabled = false;
                if (data.success) {
                    setTimeout(function() { window.location.reload(); }, 1500);
                }
            }).catch(function(err) {
                clearInterval(timer);
                document.getElementById('rescanProgressContent').classList.add('d-none');
                document.getElementById('rescanResultContent').classList.remove('d-none');
                document.getElementById('rescanResultContent').innerHTML = '<div class="alert alert-danger mb-0">Request failed: ' + (err.message || 'Unknown error') + '</div>';
                footer.classList.remove('d-none');
                btn.disabled = false;
            });
        });

        const checkEndpointsBtn = document.getElementById('checkEndpointsBtn');
        const checkEndpointsModal = document.getElementById('checkEndpointsModal');
        checkEndpointsBtn?.addEventListener('click', function() {
            const modal = window.bootstrap?.Modal?.getOrCreateInstance(checkEndpointsModal);
            if (modal) modal.show();
            document.getElementById('checkEndpointsProgress').classList.remove('d-none');
            document.getElementById('checkEndpointsResult').classList.add('d-none');
            fetch('{{ route("presale_transactions.check_endpoints") }}', {
                headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
            }).then(function(r) { return r.json(); }).then(function(data) {
                document.getElementById('checkEndpointsProgress').classList.add('d-none');
                document.getElementById('checkEndpointsResult').classList.remove('d-none');
                const tbody = document.getElementById('checkEndpointsTable');
                tbody.innerHTML = '';
                (data.results || []).forEach(function(row) {
                    const tr = document.createElement('tr');
                    tr.innerHTML = '<td>' + row.endpoint + '</td><td><span class="badge bg-' + (row.ok ? 'success' : 'danger') + '">' + (row.ok ? 'OK' : 'FAIL') + '</span></td><td class="small">' + (row.message || '') + '</td>';
                    tbody.appendChild(tr);
                });
            }).catch(function(err) {
                document.getElementById('checkEndpointsProgress').classList.add('d-none');
                document.getElementById('checkEndpointsResult').classList.remove('d-none');
                document.getElementById('checkEndpointsTable').innerHTML = '<tr><td colspan="3" class="text-danger">Request failed: ' + (err.message || 'Unknown error') + '</td></tr>';
            });
        });

        document.getElementById('usdt_amount').addEventListener('input', function () {
            const usdtAmount = parseFloat(this.value);
            const sbxPriceInput = document.getElementById('sbx_price');
            if (!isNaN(usdtAmount)) {
                sbxPriceInput.value = (usdtAmount / 0.31).toFixed(6);
            } else {
                sbxPriceInput.value = '';
            }
        });
    </script>
@endsection
<style>
    .break-all {
        word-break: break-all;
    }
</style>
