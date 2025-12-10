<?php

namespace App\Models\Catalogos;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConfiguracionCorreo extends Model
{
    use HasFactory;

    public $timestamps = false;
    protected $table = 'dbo.correoEnvioNotificaciones';
    protected $primaryKey = 'correoEnvioNotificaciones_id';
    protected $fillable = [
        'correoEnvioNotificaciones_correoNotificacion',
        'correoEnvioNotificaciones_passwordCorreo',
        'correoEnvioNotificaciones_host',
        'correoEnvioNotificaciones_puerto',
        'correoEnvioNotificaciones_seguridadSSL',
    ];
}
