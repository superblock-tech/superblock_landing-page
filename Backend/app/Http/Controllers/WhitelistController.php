<?php

namespace App\Http\Controllers;

use App\Models\Whitelist;
use Illuminate\Http\Request;

class WhitelistController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $whiteListContent = Whitelist::first();

        return view('Crypto.whitelistContent', compact('whiteListContent'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update($id, Request $request)
    {
        $whiteListContent = Whitelist::find($id);


        if($whiteListContent->update($request->all())){
            return redirect()->route('whitelist')->with('success', 'Whitelist updated successfully');
        }else{
            return redirect()->route('whitelist')->with('error', 'Whitelist not updated');
        }
    }
}
