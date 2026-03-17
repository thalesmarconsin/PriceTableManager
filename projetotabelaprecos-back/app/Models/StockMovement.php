<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StockMovement extends Model
{
    use HasFactory;

    protected $table = 'movimentacoes_estoque';

    protected $fillable = [
        'produto_id',
        'tipo_movimentacao',
        'quantidade',
        'motivo',
        'observacao',   
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'produto_id');
    }
}
