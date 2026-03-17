<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Stock extends Model
{
    use HasFactory;

    protected $table = 'estoque';

    protected $fillable = [
        'produto_id',
        'quantidade',
        'quantidade_minima',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'produto_id');
    }
}