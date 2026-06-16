<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\TestimonialResource;
use App\Models\Testimonial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TestimonialController extends Controller
{
    /**
     * Display a listing of testimonials.
     */
    public function index()
    {
        $testimonials = Testimonial::latest()->get();
        return TestimonialResource::collection($testimonials);
    }

    /**
     * Store a newly created testimonial.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'asal' => 'required|string|max:255',
            'foto' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:2048',
            'isi' => 'required|string',
            'rating' => 'required|integer|min:1|max:5',
        ]);

        if ($request->hasFile('foto')) {
            $validated['foto'] = $request->file('foto')->store('testimonials', 'public');
        }

        $testimonial = Testimonial::create($validated);

        return new TestimonialResource($testimonial);
    }

    /**
     * Display the specified testimonial.
     */
    public function show(Testimonial $testimonial)
    {
        return new TestimonialResource($testimonial);
    }

    /**
     * Update the specified testimonial.
     */
    public function update(Request $request, Testimonial $testimonial)
    {
        $validated = $request->validate([
            'nama' => 'sometimes|required|string|max:255',
            'asal' => 'sometimes|required|string|max:255',
            'foto' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:2048',
            'isi' => 'sometimes|required|string',
            'rating' => 'sometimes|required|integer|min:1|max:5',
        ]);

        if ($request->hasFile('foto')) {
            if ($testimonial->foto) {
                Storage::disk('public')->delete($testimonial->foto);
            }
            $validated['foto'] = $request->file('foto')->store('testimonials', 'public');
        }

        $testimonial->update($validated);

        return new TestimonialResource($testimonial);
    }

    /**
     * Remove the specified testimonial.
     */
    public function destroy(Testimonial $testimonial)
    {
        if ($testimonial->foto) {
            Storage::disk('public')->delete($testimonial->foto);
        }

        $testimonial->delete();

        return response()->json(['message' => 'Testimoni berhasil dihapus.']);
    }
}
