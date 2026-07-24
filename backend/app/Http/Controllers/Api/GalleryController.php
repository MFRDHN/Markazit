<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\GalleryResource;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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

        $fotoPath = null;

        try {
            DB::beginTransaction();

            if ($request->hasFile('foto')) {
                $fotoPath = $request->file('foto')->store('gallery', 'public');
                $validated['foto'] = $fotoPath;
            }

            $gallery = Gallery::create($validated);

            DB::commit();

            return new GalleryResource($gallery);

        } catch (\Exception $e) {
            DB::rollBack();

            if ($fotoPath) {
                Storage::disk('public')->delete($fotoPath);
            }

            Log::error('Gallery store failed: ' . $e->getMessage());

            return response()->json(['message' => 'Gagal menyimpan galeri.'], 500);
        }
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

        $oldFoto = null;

        try {
            DB::beginTransaction();

            if ($request->hasFile('foto')) {
                $oldFoto = $gallery->foto;
                $validated['foto'] = $request->file('foto')->store('gallery', 'public');
            }

            $gallery->update($validated);

            if ($oldFoto) {
                Storage::disk('public')->delete($oldFoto);
            }

            DB::commit();

            return new GalleryResource($gallery);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Gallery update failed: ' . $e->getMessage());

            return response()->json(['message' => 'Gagal mengupdate galeri.'], 500);
        }
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
        $categories = Gallery::whereNotNull('kategori')->distinct()->pluck('kategori');
        return response()->json(['data' => $categories]);
    }
}
