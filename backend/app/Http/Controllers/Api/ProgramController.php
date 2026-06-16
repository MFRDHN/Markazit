<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProgramResource;
use App\Models\Program;
use Illuminate\Http\Request;

class ProgramController extends Controller
{
    /**
     * Display a listing of programs.
     */
    public function index()
    {
        $programs = Program::orderBy('urutan')->get();
        return ProgramResource::collection($programs);
    }

    /**
     * Store a newly created program.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'icon' => 'nullable|string|max:255',
            'urutan' => 'nullable|integer',
        ]);

        $program = Program::create($validated);

        return new ProgramResource($program);
    }

    /**
     * Display the specified program.
     */
    public function show(Program $program)
    {
        return new ProgramResource($program);
    }

    /**
     * Update the specified program.
     */
    public function update(Request $request, Program $program)
    {
        $validated = $request->validate([
            'nama' => 'sometimes|required|string|max:255',
            'deskripsi' => 'sometimes|required|string',
            'icon' => 'nullable|string|max:255',
            'urutan' => 'nullable|integer',
        ]);

        $program->update($validated);

        return new ProgramResource($program);
    }

    /**
     * Remove the specified program.
     */
    public function destroy(Program $program)
    {
        $program->delete();

        return response()->json(['message' => 'Program berhasil dihapus.']);
    }
}
