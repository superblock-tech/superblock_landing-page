<?php

namespace App\Http\Controllers;

use App\Models\ContactForm;
use Illuminate\Http\Request;

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
        ]);

        $form = new ContactForm();
        $form->fullName = $request->fullName;
        $form->email = $request->email;
        $form->phone = $request->phone;
        $form->joinWhitelist = $request->joinWhitelist ?? 0;

        if($form->save()) {
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
}
