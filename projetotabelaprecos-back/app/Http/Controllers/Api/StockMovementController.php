<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Stock;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockMovementController extends Controller
{
    public function index(Request $request)
    {
        $query = StockMovement::with(['product.category']);

        if ($request->has('produto_id')) {
            $query->where('produto_id', $request->produto_id);
        }

        if ($request->has('tipo_movimentacao')) {
            $query->where('tipo_movimentacao', $request->tipo_movimentacao);
        }

        return $query->orderBy('created_at', 'desc')->get();
    }

    public function store(Request $request)
{
    $validated = $request->validate([
        'produto_id' => 'required|exists:produtos,id',
        'tipo_movimentacao' => 'required|in:entrada,saida,ajuste',
        'quantidade' => 'required|integer|min:1',
        'motivo' => 'nullable|string|max:255',
        'observacao' => 'nullable|string'
    ]);

    $product = Product::findOrFail($validated['produto_id']);
    $stock = Stock::where('produto_id', $product->id)->first();

    if (!$stock) {
        return response()->json([
            'mensagem' => 'Estoque não encontrado para este produto',
            'status' => 404
        ], 404);
    }

    if (
        $validated['tipo_movimentacao'] === 'saida' &&
        $stock->quantidade < $validated['quantidade']
    ) {
        return response()->json([
            'mensagem' => 'Quantidade insuficiente em estoque',
            'status' => 422
        ], 422);
    }

    try {
        DB::beginTransaction();

        if ($validated['tipo_movimentacao'] === 'entrada') {
            $stock->quantidade += $validated['quantidade'];
        } elseif ($validated['tipo_movimentacao'] === 'saida') {
            $stock->quantidade -= $validated['quantidade'];
        } elseif ($validated['tipo_movimentacao'] === 'ajuste') {
            $stock->quantidade = $validated['quantidade'];
        }

        $stock->save();

        $movement = StockMovement::create([
            'produto_id' => $validated['produto_id'],
            'tipo_movimentacao' => $validated['tipo_movimentacao'],
            'quantidade' => $validated['quantidade'],
            'motivo' => $validated['motivo'] ?: null,
            'observacao' => $validated['observacao'] ?: null,
        ]);

        DB::commit();

        return response()->json([
            'mensagem' => 'Movimentação registrada com sucesso',
            'movimentacao' => $movement->load(['product.category']),
            'estoque_atual' => $stock
        ], 201);
    } catch (\Exception $e) {
        DB::rollBack();

        return response()->json([
            'mensagem' => 'Erro ao registrar movimentação',
            'erro' => $e->getMessage()
        ], 500);
    }
}
}