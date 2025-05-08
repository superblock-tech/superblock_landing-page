<?php

namespace App\Http\Controllers;

use App\Exports\ContactsExport;
use App\Imports\ContactsImport;
use App\Models\ContactForm;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Maatwebsite\Excel\Facades\Excel;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class ContactFormController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contacts = ContactForm::where('joinWhitelist', false)->get();
        return view('Contact.contacts', compact('contacts'));
    }

    /**
     * Display a listing of the resource.
     */

    public function joinUs()
    {
        $contacts = ContactForm::where('joinWhitelist', true)->get();
        return view('Contact.joinUs', compact('contacts'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'fullName' => 'required',
            'email' => 'required',
            'phone' => 'required',
            'country' => 'required',
            'investment_interest' => 'required',
            'joinWhitelist' => 'required'
        ]);

        if(ContactForm::query()->create($request->all())) {
            return response()->json(['message' => 'Contact form submitted successfully']);
        } else {
            return response()->json(['message' => 'Failed to submit contact form']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $contact = ContactForm::find($id);

        if($contact->delete()) {
            return redirect()->route('contactForm')->with('success', 'Contact form deleted successfully');
        } else {
            return redirect()->route('contactForm')->with('error', 'Failed to delete contact form');
        }
    }

    final public function import(Request $request): RedirectResponse
    {
        Excel::import(new ContactsImport(), $request->file('file'));

        return back()->with('success', 'Contacts Imported Successfully!');
    }

    final public function export(): BinaryFileResponse
    {
        return Excel::download(new ContactsExport(), 'contacts.xlsx');
    }
}
