<?php

namespace App\Models\Catalogos;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CorreoNotificacion extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $table = 'dbo.correoNotificaciones';
    protected $primaryKey = 'correoNotificaciones_id';
    protected $fillable = [
        'correoNotificaciones_correo',
        'correoNotificaciones_idUsuario',
        'correoNotificaciones_estatus',
        'correoNotificaciones_idAsunto',
    ];

    public function usuario(): BelongsTo
    {
        return $this->belongsTo(User::class, 'correoNotificaciones_idUsuario', 'Personas_usuarioID');
    }
    public function asunto(): BelongsTo
    {
        return $this->belongsTo(Asuntos::class, 'correoNotificaciones_idAsunto', 'Asuntos_id');
    }
}
