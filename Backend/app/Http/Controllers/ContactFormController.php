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
        $contacts = ContactForm::all();
        return view('Contact.contacts', compact('contacts'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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

        if($form->save()) {
            return response()->json(['message' => 'Contact form submitted successfully']);
        } else {
            return response()->json(['message' => 'Failed to submit contact form']);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(ContactForm $contactForm)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(ContactForm $contactForm)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, ContactForm $contactForm)
    {
        //
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
