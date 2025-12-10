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

            //          'codigoAutorizacion_codigo',
            // 'codigoAutorizacion_idUnidad',
            // 'codigoAutorizacion_idUsuarioAutoriza',
            // 'codigoAutorizacion_idUsuarioSolicita',
            // 'codigoAutorizacion_motivo',
            // 'codigoAutorizacion_fechaAut',
            // 'codigoAutorizacion_fecha',
            // 'codigoAutorizacion_estatus',

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


    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
