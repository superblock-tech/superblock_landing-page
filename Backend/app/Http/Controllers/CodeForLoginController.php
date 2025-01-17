<?php

namespace App\Http\Controllers;

use App\Models\CodeForLogin;
use Illuminate\Http\Request;

class CodeForLoginController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
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
        try {
            $code = new CodeForLogin();
            $code->code = $request->code;
            $code->nameOfPerson = $request->nameOfPerson;
            $code->email = $request->email;

            $code->save();

            return redirect()->route('dashboard')->with('success', 'Code successfully added!');
        } catch (\Exception $e) {
            return redirect()->route('dashboard')->with('error', 'Failed to add code. Please try again.');
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(CodeForLogin $codeForLogin)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CodeForLogin $codeForLogin)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, CodeForLogin $codeForLogin)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($code)
    {
        try {
            $code = CodeForLogin::findOrFail($code); // Ensure the code exists, throw 404 if not
            $code->delete();

            return redirect()->route('dashboard')->with('success', 'Code successfully deleted!');
        } catch (\Exception $e) {
            return redirect()->route('dashboard')->with('error', 'Failed to delete code. Please try again.');
        }
    }
}
