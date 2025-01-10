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
                            <a class="nav-link active" href="{{ route('dashboard') }}">View Codes</a>
                        </li>
                        <li class="nav-item">
                            <!-- Trigger modal -->
                            <a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#addCodeModal">Add Code</a>
                        </li>
                    </ul>
                </nav>

                <div class="mt-3">
                    <h3>Code List</h3>
                    <table class="table table-bordered">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Code</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        @forelse($codes as $code)
                            <tr>
                                <td>{{ $code->id }}</td>
                                <td>{{ $code->code }}</td>
                                <td>{{ $code->nameOfPerson }}</td>
                                <td>{{ $code->email }}</td>
                                <td>
                                    <!-- Delete Button Trigger -->
                                    <a href="#" class="btn btn-sm btn-danger" data-bs-toggle="modal" data-bs-target="#deleteCodeModal" data-id="{{ $code->id }}" data-name="{{ $code->code }}">Delete</a>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5">No codes available.</td>
                            </tr>
                        @endforelse
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Add Code Modal -->
    <div class="modal fade" id="addCodeModal" tabindex="-1" aria-labelledby="addCodeModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="addCodeModalLabel">Add New Code</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <form action="{{ route('code_logins.store') }}" method="POST">
                    @csrf
                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="code" class="form-label">Code</label>
                            <input type="text" name="code" id="code" class="form-control" required>
                        </div>
                        <div class="mb-3">
                            <label for="nameOfPerson" class="form-label">Name</label>
                            <input type="text" name="nameOfPerson" id="nameOfPerson" class="form-control">
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input type="email" name="email" id="email" class="form-control">
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

    <!-- Delete Confirmation Modal -->
    <div class="modal fade" id="deleteCodeModal" tabindex="-1" aria-labelledby="deleteCodeModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="deleteCodeModalLabel">Delete Code</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete the code <span id="codeToDelete"></span>?
                </div>
                <div class="modal-footer">
                    <form id="deleteCodeForm" method="POST">
                        @csrf
                        @method('DELETE')
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-danger">Delete</button>
                    </form>
                </div>
            </div>
        </div>
    </div>


    <script>
        document.getElementById('deleteCodeModal').addEventListener('show.bs.modal', function (event) {
            const button = event.relatedTarget; // The button that triggered the modal
            const codeId = button.getAttribute('data-id'); // Extract the code ID
            const codeName = button.getAttribute('data-name'); // Extract the code name

            // Update the modal content to show which code is being deleted
            document.getElementById('codeToDelete').textContent = codeName;

            // Dynamically set the form's action URL with the correct codeId
            const form = document.getElementById('deleteCodeForm');
            form.action = "/code_logins/" + codeId; // Set the correct URL with the code ID
        });

        function generateRandomCode() {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let randomCode = 'VIP1192-';

            for (let i = 0; i < 15; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                randomCode += characters[randomIndex];
            }
            return randomCode;
        }

        document.getElementById('addCodeModal').addEventListener('show.bs.modal', function () {
            const codeInput = document.getElementById('code');
            codeInput.value = generateRandomCode();
        });
    </script>
@endsection
