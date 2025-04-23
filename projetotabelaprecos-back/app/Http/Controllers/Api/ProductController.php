<?php

namespace App\Http\Controllers\Api;

use App\Models\Product;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with('category');

        if ($request->has('categoria_id')) {
            $query->where('categoria_id', $request->category_id);
        }

        if ($request->has('sort')) {
            $sort = $request->sort;
            if (in_array($sort, ['name', 'price'])) {
                $query->orderBy($sort);
            }
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'preco' => 'required|numeric|min:0',
            'categoria_id' => 'required|exists:categories,id'
        ]);

        return Product::create($validated);
    }

    public function show($id)
    {
        $product = Product::with('category')->find($id);

        if (!$product) {
            return response()->json([
                'mensagem' => 'Produto não encontrado',
                'status' => 404
            ], 404);
        }

        return response()->json(['product' => $product], 200);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'nome' => 'sometimes|string|max:255',
            'preco' => 'sometimes|numeric|min:0',
            'categoria_id' => 'sometimes|exists:categories,id'
        ]);

        $product->update($validated);
        return $product;
    }

    public function destroy($id)
    {
        Product::destroy($id);
        return response()->noContent();
    }
}
