<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Stock;
use Illuminate\Http\Request;

class StockController extends Controller
{
    public function index(Request $request)
    {
        $query = Stock::with(['product.category']);

        if ($request->has('categoria_id')) {
            $query->whereHas('product', function ($q) use ($request) {
                $q->where('categoria_id', $request->category_id);
            });
        }

        if ($request->has('produto_id')) {
            $query->where('produto_id', $request->product_id);
        }

        return $query->get()->map(function ($stock) {
            $status = 'estoque_ok';

            if ($stock->quantidade == 0) {
                $status = 'sem_estoque';
            } elseif ($stock->quantidade <= $stock->quantidade_minima) {
                $status = 'estoque_baixo';
            }

            return [
                'id' => $stock->id,
                'produto_id' => $stock->produto_id,
                'produto' => $stock->product->nome,
                'categoria' => $stock->product->category->nome ?? null,
                'preco' => $stock->product->preco,
                'quantidade' => $stock->quantidade,
                'quantidade_minima' => $stock->quantidade_minima,
                'status' => $status,
                'created_at' => $stock->created_at,
                'updated_at' => $stock->updated_at,
            ];
        });
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nome' => 'required|string|max:255',
            'preco' => 'required|numeric|min:0',
            'categoria_id' => 'required|exists:categorias,id'
        ]);

        $product = Product::create($validated);

        Stock::create([
            'produto_id' => $product->id,
            'quantidade' => 0,
            'quantidade_minima' => 0
        ]);

        return $product->load(['category', 'stock']);
    }

    public function show($id)
    {
        $stock = Stock::with(['product.category'])->find($id);

        if (!$stock) {
            return response()->json([
                'mensagem' => 'Estoque não encontrado',
                'status' => 404
            ], 404);
        }

        $status = 'estoque_ok';

        if ($stock->quantidade == 0) {
            $status = 'sem_estoque';
        } elseif ($stock->quantidade <= $stock->quantidade_minima) {
            $status = 'estoque_baixo';
        }

        return response()->json([
            'id' => $stock->id,
            'produto_id' => $stock->produto_id,
            'produto' => $stock->product->nome,
            'categoria' => $stock->product->category->nome ?? null,
            'preco' => $stock->product->preco,
            'quantidade' => $stock->quantidade,
            'quantidade_minima' => $stock->quantidade_minima,
            'status' => $status,
            'created_at' => $stock->created_at,
            'updated_at' => $stock->updated_at,
        ], 200);
    }

    public function updateMinimum(Request $request, $id)
    {
        $stock = Stock::findOrFail($id);

        $validated = $request->validate([
            'quantidade_minima' => 'required|integer|min:0'
        ]);

        $stock->update($validated);

        return response()->json([
            'mensagem' => 'Quantidade mínima atualizada com sucesso',
            'estoque' => $stock
        ], 200);
    }
}