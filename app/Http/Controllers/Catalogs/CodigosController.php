<?php

namespace App\Http\Controllers\Catalogs;

use App\Http\Controllers\Controller;
use App\Models\Catalogos\CodigoAutorizacion;
use Illuminate\Http\Request;

class CodigosController extends Controller
{
    public function index()
    {
        try {
            // Obtener todos los destinos
            $codigos = CodigoAutorizacion::where('codigoAutorizacion_estatus', true)
                ->with('unidades')
                ->get();


            // Devolver respuesta JSON
            return response()->json(
                $codigos,
                200
            );
        } catch (\Exception $e) {
            // Log::error("Error al obtener la lista de destinos: " . $e->getMessage());
            return response()->json([
                'message' => 'Error interno al obtener los destinos',
                'error' => $e->getMessage()
            ], 500);
        }
    }

}
