<?php

namespace App\Http\Controllers;

use App\Models\CodeForLogin;
use App\Models\Token;
use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
      if(Auth::check()){
        return redirect()->route('dashboard');
      }
        return view('User.adminLogin');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        $user = User::where('email', $request->email)->first() ?? null;

        if ($user && Hash::check($request->password, $user->password)) {
            Auth::login($user);

            return redirect()->route('dashboard');
        }

        return redirect()->back()->with('error', 'Invalid email or password');
    }

    public function loginForUser(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 401);
        }

        if (CodeForLogin::where('code', $request->code)->exists()) {
            $token = Str::random(60);

            Token::create([
                'token' => $token,
            ]);

            return response()->json([
                'success' => 'Code is valid',
                'token' => $token
            ], 200);
        }

        return response()->json(['error' => 'Invalid email or password'], 401);
    }

    public function dashboard()
    {
        $codes = CodeForLogin::all();
        return view('User.adminDashboard', compact('codes'));
    }


    public function logout()
    {
        Auth::logout();

        return redirect()->route('adminLoginIndex');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
