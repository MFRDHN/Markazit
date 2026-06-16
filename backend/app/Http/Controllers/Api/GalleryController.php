<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GalleryResource;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    /**
     * Display a listing of galleries.
     */
    public function index(Request $request)
    {
        $query = Gallery::latest();

        if ($request->has('kategori') && $request->kategori !== 'all') {
            $query->where('kategori', $request->kategori);
        }

        $galleries = $query->paginate($request->get('per_page', 20));

        return GalleryResource::collection($galleries);
    }

    /**
     * Store a newly created gallery item.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'foto' => 'required|file|mimes:jpg,jpeg,png,webp|max:5120',
            'kategori' => 'nullable|string|max:100',
            'deskripsi' => 'nullable|string',
        ]);

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('gallery', 'public');
        }

        $gallery = Gallery::create($validated);

        return new GalleryResource($gallery);
    }

    /**
     * Display the specified gallery item.
     */
    public function show(Gallery $gallery)
    {
        return new GalleryResource($gallery);
    }

    /**
     * Update the specified gallery item.
     */
    public function update(Request $request, Gallery $gallery)
    {
        $validated = $request->validate([
            'judul' => 'sometimes|required|string|max:255',
            'foto' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:5120',
            'kategori' => 'nullable|string|max:100',
            'deskripsi' => 'nullable|string',
        ]);

        if ($request->hasFile('foto')) {
            // Delete old photo
            if ($gallery->foto) {
                Storage::disk('public')->delete($gallery->foto);
            }
            $validated['foto'] = $request->file('foto')->store('gallery', 'public');
        }

        $gallery->update($validated);

        return new GalleryResource($gallery);
    }

    /**
     * Remove the specified gallery item.
     */
    public function destroy(Gallery $gallery)
    {
        if ($gallery->foto) {
            Storage::disk('public')->delete($gallery->foto);
        }

        $gallery->delete();

        return response()->json(['message' => 'Galeri berhasil dihapus.']);
    }

    /**
     * Get available categories.
     */
    public function categories()
    {
        $categories = Gallery::distinct()->pluck('kategori')->filter()->values();
        return response()->json(['data' => $categories]);
    }
}
