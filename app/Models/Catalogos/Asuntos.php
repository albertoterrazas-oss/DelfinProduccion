<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Asuntos extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $table = 'dbo.Asuntos';
    protected $primaryKey = 'Asuntos_id';
    protected $fillable = [
        'Asuntos_nombre',
        'Asuntos_descripcion',
    ];
}
