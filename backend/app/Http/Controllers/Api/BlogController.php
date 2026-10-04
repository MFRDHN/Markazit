<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\BlogResource;
use App\Models\Blog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class BlogController extends Controller
{
    /**
     * Allowlist HTML sanitizer for blog content (stored XSS guard).
     * ponytail: stdlib DOM walker covers this site's tag set; swap to
     * HTMLPurifier if editors ever need images/embeds/inline styles.
     */
    private function sanitizeHtml(string $html): string
    {
        $allowed = ['p','b','strong','i','em','u','s','h1','h2','h3','h4','h5','h6',
            'ul','ol','li','a','br','hr','blockquote','pre','code','span'];
        $drop = ['script','style','iframe','object','embed','form','input','button',
            'textarea','select','svg','math','noscript','link','meta'];

        $doc = new \DOMDocument();
        libxml_use_internal_errors(true);
        $ok = $doc->loadHTML(
            '<?xml encoding="utf-8"?><body>' . $html . '</body>',
            LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD
        );
        libxml_clear_errors();
        if (!$ok) {
            return strip_tags($html);
        }

        $toRemove = [];
        foreach (iterator_to_array($doc->getElementsByTagName('*')) as $node) {
            $tag = strtolower($node->nodeName);

            // Skip our own wrapper elements
            if ($tag === 'html' || $tag === 'body') {
                continue;
            }

            if (in_array($tag, $drop, true)) {
                $toRemove[] = $node;
                continue;
            }

            if (!in_array($tag, $allowed, true)) {
                // Unknown but benign tag: unwrap, keep its content
                while ($node->firstChild) {
                    $node->parentNode->insertBefore($node->firstChild, $node);
                }
                $toRemove[] = $node;
                continue;
            }

            for ($i = $node->attributes->length - 1; $i >= 0; $i--) {
                $name = strtolower($node->attributes->item($i)->nodeName);
                if ($tag === 'a' && $name === 'href'
                    && preg_match('/^(https?:\/\/|mailto:)/i', trim($node->getAttribute($name)))) {
                    $node->setAttribute('rel', 'noopener nofollow');
                    continue;
                }
                if ($tag === 'a' && $name === 'title') {
                    continue;
                }
                $node->removeAttribute($name);
            }
        }

        foreach ($toRemove as $node) {
            $node->parentNode?->removeChild($node);
        }

        $out = '';
        foreach ($doc->getElementsByTagName('body')->item(0)->childNodes as $child) {
            $out .= $doc->saveHTML($child);
        }
        return $out;
    }

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
            $search = addcslashes($request->search, '\\%_');
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

        $validated['konten'] = $this->sanitizeHtml($validated['konten']);

        $thumbPath = null;

        try {
            DB::beginTransaction();

            if ($request->hasFile('thumbnail')) {
                $thumbPath = $request->file('thumbnail')->store('blogs', 'public');
                $validated['thumbnail'] = $thumbPath;
            }

            // Handle duplicate slug
            $baseSlug = $validated['slug'];
            $counter = 1;
            while (Blog::where('slug', $validated['slug'])->exists()) {
                $validated['slug'] = $baseSlug . '-' . $counter++;
            }

            $blog = Blog::create($validated);

            DB::commit();

            return new BlogResource($blog);

        } catch (\Exception $e) {
            DB::rollBack();

            if ($thumbPath) {
                Storage::disk('public')->delete($thumbPath);
            }

            Log::error('Blog store failed: ' . $e->getMessage());

            return response()->json(['message' => 'Gagal menyimpan artikel.'], 500);
        }
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

        $oldThumb = null;

        if (isset($validated['konten'])) {
            $validated['konten'] = $this->sanitizeHtml($validated['konten']);
        }

        try {
            DB::beginTransaction();

            if ($request->hasFile('thumbnail')) {
                $oldThumb = $blog->thumbnail;
                $validated['thumbnail'] = $request->file('thumbnail')->store('blogs', 'public');
            }

            $blog->update($validated);

            // Delete old file after successful update
            if ($oldThumb) {
                Storage::disk('public')->delete($oldThumb);
            }

            DB::commit();

            return new BlogResource($blog);

        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Blog update failed: ' . $e->getMessage());

            return response()->json(['message' => 'Gagal mengupdate artikel.'], 500);
        }
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
        $categories = Blog::whereNotNull('kategori')->distinct()->pluck('kategori');
        return response()->json(['data' => $categories]);
    }
}
