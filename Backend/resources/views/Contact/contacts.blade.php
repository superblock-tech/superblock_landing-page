@extends('Layouts.main')

@section('content')
    <div class="container mt-4">
        <div class="row">
            <div class="col-md-12">
                <nav>
                    <ul class="nav nav-tabs">
                        <li class="nav-item">
                            <a class="nav-link active" href="">View Contacts</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#" data-bs-toggle="modal" data-bs-target="#importModal">Import Contacts</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="{{ route('contacts.export') }}">Export Contacts</a>
                        </li>
                    </ul>
                </nav>

                <div class="mt-3">
                    <h3>Contact List</h3>
                    <table class="table table-bordered">
                        <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Country</th>
                            <th>Investment Interest</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        @forelse($contacts as $contact)
                            <tr>
                                <td>{{ $contact->id }}</td>
                                <td>{{ $contact->fullName }}</td>
                                <td>{{ $contact->email }}</td>
                                <td>{{ $contact->phone }}</td>
                                <td>{{ $contact->country }}</td>
                                <td>{{ $contact->investment_interest }}</td>
                                <td>
                                    <!-- Delete Button -->
                                    <form action="{{ route('contacts.destroy', $contact->id) }}" method="POST" onsubmit="return confirm('Are you sure you want to delete this contact?');">
                                        @csrf
                                        @method('DELETE')
                                        <button type="submit" class="btn btn-sm btn-danger">Delete</button>
                                    </form>
                                </td>
                            </tr>
                        @empty
                            <tr>
                                <td colspan="5">No contacts available.</td>
                            </tr>
                        @endforelse
                        </tbody>
                    </table>
                </div>
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
                    <form id="importForm" action="{{ route('contacts.import') }}" method="POST" enctype="multipart/form-data">
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
@endsection
