<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlogResource;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    /**
     * Display a listing of blog posts.
     */
    public function index(Request $request)
    {
        $query = Blog::latest();

        if ($request->has('kategori') && $request->kategori !== 'all') {
            $query->where('kategori', $request->kategori);
        }

        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('judul', 'like', "%{$search}%")
                  ->orWhere('konten', 'like', "%{$search}%");
            });
        }

        $blogs = $query->paginate($request->get('per_page', 12));

        return BlogResource::collection($blogs);
    }

    /**
     * Store a newly created blog post.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'judul' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blogs,slug',
            'thumbnail' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:5120',
            'konten' => 'required|string',
            'kategori' => 'nullable|string|max:100',
            'meta_desc' => 'nullable|string|max:255',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['judul']);
        }

        if ($request->hasFile('thumbnail')) {
            $validated['thumbnail'] = $request->file('thumbnail')->store('blogs', 'public');
        }

        $blog = Blog::create($validated);

        return new BlogResource($blog);
    }

    /**
     * Display the specified blog post by slug.
     */
    public function show(Blog $blog)
    {
        return new BlogResource($blog);
    }

    /**
     * Update the specified blog post.
     */
    public function update(Request $request, Blog $blog)
    {
        $validated = $request->validate([
            'judul' => 'sometimes|required|string|max:255',
            'slug' => 'nullable|string|max:255|unique:blogs,slug,' . $blog->id,
            'thumbnail' => 'nullable|file|mimes:jpg,jpeg,png,webp|max:5120',
            'konten' => 'sometimes|required|string',
            'kategori' => 'nullable|string|max:100',
            'meta_desc' => 'nullable|string|max:255',
        ]);

        if ($request->hasFile('thumbnail')) {
            if ($blog->thumbnail) {
                Storage::disk('public')->delete($blog->thumbnail);
            }
            $validated['thumbnail'] = $request->file('thumbnail')->store('blogs', 'public');
        }

        $blog->update($validated);

        return new BlogResource($blog);
    }

    /**
     * Remove the specified blog post.
     */
    public function destroy(Blog $blog)
    {
        if ($blog->thumbnail) {
            Storage::disk('public')->delete($blog->thumbnail);
        }

        $blog->delete();

        return response()->json(['message' => 'Artikel berhasil dihapus.']);
    }

    /**
     * Get available categories.
     */
    public function categories()
    {
        $categories = Blog::distinct()->pluck('kategori')->filter()->values();
        return response()->json(['data' => $categories]);
    }
}
