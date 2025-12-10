<?php

namespace App\Models;

use App\Models\Catalogos\Puestos;
use App\Models\Menu;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $table = 'dbo.Personas';
    public $timestamps = false;
    protected $primaryKey = 'Personas_usuarioID';

    protected $fillable = [
        'Personas_nombres',
        'Personas_apPaterno',
        'Personas_apMaterno',
        'Personas_telefono',
        'Personas_direccion',
        'Personas_fechaNacimiento',
        'Personas_correo',
        'Personas_puesto',
        'Personas_licencia',
        'Personas_vigenciaLicencia',
        'Personas_usuario',
        'Personas_contrasena',
        'Personas_esEmpleado',
        'usuario_idRol'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'Personas_contrasena',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        // Esta línea asegura que la contraseña se hashee automáticamente con Bcrypt
        'Personas_contrasena' => 'hashed', 
    ];
    
    /**
     * Sobreescribe el método de autenticación para indicarle a Laravel 
     * cuál es la columna de la contraseña.
     */
    public function getAuthPassword(): string
    {
        return $this->Personas_contrasena;
    }

    public function menus()
    {
        return $this->belongsToMany(Menu::class, 'usuarioxmenu', 'usuarioxmenu_idusuario', 'usuarioxmenu_idmenu')
            ->withPivot('usuarioxmenu_idusuario', 'usuarioxmenu_idmenu', 'usuarioxmenu_alta', 'usuarioxmenu_consulta', 'usuarioxmenu_especial', 'usuarioxmenu_cambio',);
    }

    
    public function puesto(): BelongsTo
    {
        return $this->belongsTo(Puestos::class, 'Personas_puesto','Puestos_id');
    }
}