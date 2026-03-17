<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $table = 'produtos';

    protected $fillable = [
        'nome',
        'preco',
        'categoria_id',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class, 'categoria_id');
    }

    public function stock()
    {
        return $this->hasOne(Stock::class, 'produto_id');
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class, 'produto_id');
    }
}
