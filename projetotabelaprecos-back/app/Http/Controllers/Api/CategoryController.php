<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index()
    {
        return Category::all();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
        ]);

        return Category::create($validated);
    }

    public function show($id)
    {
        $category = Category::find($id);

        if (!$category) {
            return response()->json([
                'mensagem' => 'Categoria não encontrada',
                'status' => 404
            ], 404);
        }

        return response()->json(['category' => $category], 200);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validated = $request->validate([
            'nome' => 'required|string|max:255',
        ]);

        $category->update($validated);
        return $category;
    }

    public function destroy($id)
    {
        Category::destroy($id);
        return response()->noContent();
    }
}
