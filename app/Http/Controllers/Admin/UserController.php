<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin\Menu;
use App\Models\Roles;
use App\Models\User;
use App\Models\UserxMenu;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        // 1. Obtiene todos los registros del modelo User.
        $users = User::all();

        // 2. Mapea la colección para añadir el campo 'nombre_completo'
        $usersWithFullName = $users->map(function ($user) {
            // Concatenamos los campos del objeto User
            $user->nombre_completo = $user->Personas_nombres . ' ' .
                $user->Personas_apPaterno . ' ' .
                $user->Personas_apMaterno;

            // El objeto modificado se devuelve y forma parte de la nueva colección
            return $user;
        });

        // 3. Devuelve la colección modificada como respuesta JSON.
        // Tenga en cuenta que esto devuelve la colección de objetos Eloquent con el campo agregado.
        return response()->json($usersWithFullName);
    }


    public function choferes()
    {
        // 1. Obtiene todos los registros del modelo User, cargando la relación 'puesto'.
        $allUsers = User::with('puesto')->get();

        // 2. Filtra la colección para obtener SOLO a los usuarios cuyo Puestos_nombre es 'CHOFER'.
        // Usamos optional() para evitar errores si la relación 'puesto' es nula.
        $choferes = $allUsers->filter(function ($user) {
            return optional($user->puesto)->Puestos_nombre === 'CHOFER';
        });

        // 3. Mapea la colección filtrada para añadir el campo 'nombre_completo'.
        $choferesWithFullName = $choferes->map(function ($user) {
            // Concatenamos los campos del objeto User
            $user->nombre_completo = $user->Personas_nombres . ' ' .
                $user->Personas_apPaterno . ' ' .
                $user->Personas_apMaterno;

            // El objeto modificado se devuelve y forma parte de la nueva colección
            return $user;
        });

        // 4. Devuelve la colección modificada y filtrada como respuesta JSON.
        // Usamos ->values() para reindexar la colección de 0 a N si fue filtrada.
        return response()->json($choferesWithFullName->values());
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'Personas_nombres' => 'required|string|max:255',
            'Personas_apPaterno' => 'required|string|max:255',
            'Personas_correo' => 'required|string|email|max:255',
            'Personas_contrasena' => 'required|string|min:8',
            'Personas_usuario' => 'required|string|max:255',
            'usuario_idRol' => 'required',
        ]);

        if ($validator->fails()) {
            // Retorna 400 Bad Request con los errores de validación
            return response()->json($validator->errors(), 400);
        }

        $user = User::create([
            'Personas_nombres' => $request->Personas_nombres,
            'Personas_apPaterno' => $request->Personas_apPaterno,
            'Personas_apMaterno' => $request->Personas_apMaterno,
            'Personas_telefono' => $request->Personas_telefono,
            'Personas_direccion' => $request->Personas_direccion,
            'Personas_fechaNacimiento' => $request->Personas_fechaNacimiento,
            'Personas_correo' => $request->Personas_correo,
            'Personas_puesto' => $request->Personas_puesto,
            'Personas_licencia' => $request->Personas_licencia,
            'Personas_vigenciaLicencia' => $request->Personas_vigenciaLicencia,
            'Personas_usuario' => $request->Personas_usuario,
            'Personas_contrasena' => \Illuminate\Support\Facades\Hash::make($request->Personas_contrasena),
            'usuario_idRol' => $request->usuario_idRol,
            'Personas_esEmpleado' => $request->Personas_esEmpleado ?? false, // Default to false if not provided
        ]);

        // Retorna 201 Created
        return response()->json($user, 201);
    }


    public function show($id)
    {
        $user = User::find($id);

        if (!$user) {
            // Retorna 404 Not Found
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        return response()->json($user);
    }

    // public function update(Request $request, $id)
    // {
    //     $user = User::find($id);

    //     if (!$user) {
    //         // Retorna 404 Not Found
    //         return response()->json(['message' => 'Usuario no encontrado'], 404);
    //     }

    //     // Reglas de validación para la actualización
    //     $validator = Validator::make($request->all(), [
    //         'Personas_nombres' => 'sometimes|required|string|max:255',
    //         'Personas_apPaterno' => 'sometimes|required|string|max:255',
    //         'Personas_correo' => 'sometimes|required|string|email|max:255',
    //         'Personas_usuario' => 'sometimes|required|string|max:255',
    //         'Personas_contrasena' => 'sometimes|nullable|string|min:8',
    //         'usuario_idRol'  => 'required',
    //     ]);

    //     if ($validator->fails()) {
    //         // Retorna 400 Bad Request con los errores de validación
    //         return response()->json($validator->errors(), 400);
    //     }

    //     // Manejar la actualización de la contraseña por separado para que el 'casts' la hashee
    //     if ($request->filled('Personas_contrasena')) {
    //         $user->Personas_contrasena = $request->Personas_contrasena;
    //     }

    //     if ($user->isDirty('usuario_idRol')) {
    //         $nuevoRol = Roles::find($request->usuario_idRol);

    //         $nuevosMenus = collect($nuevoRol->menus)->map(fn($m) => $m['menu_id']);

    //         UserxMenu::where('usuarioxmenu_idusuario', $id)
    //             // ->where('usuarioxmenu_idempresa', $Empresa)
    //             // ->where('usuarioxmenu_idcentrocostos', $CentroCostos)
    //             ->delete();

    //         // Preparar los menús a adjuntar
    //         $menusToAttach = [];

    //         foreach ($nuevosMenus as $menuId) {
    //             $menusToAttach[$menuId] = [
    //                 'usuarioxmenu_alta' => 1,
    //                 'usuarioxmenu_especial' => 0,
    //                 'usuarioxmenu_cambio' => 1,
    //                 'usuarioxmenu_consulta' => 1,

    //             ];
    //         }
    //     }

    //     if (!empty($menusToAttach)) {
    //         $usuario->menus()->attach($menusToAttach);
    //     }


    //     // Llenar el resto de los campos excluyendo la contraseña (ya manejada)
    //     $user->fill($request->except('Personas_contrasena'));
    //     $user->save();

    //     return response()->json([
    //         'message' => 'Usuario actualizado exitosamente',
    //         'user' => $user
    //     ], 200); // Retorna 200 OK
    // }



    public function update(Request $request, $id)
    {
        // 1. Encontrar el usuario
        $user = User::find($id);

        if (!$user) {
            // Retorna 404 Not Found
            return response()->json(['message' => 'Usuario no encontrado'], 404);
        }

        // 2. Reglas de validación para la actualización
        $validator = Validator::make($request->all(), [
            'Personas_nombres' => 'sometimes|required|string|max:255',
            'Personas_apPaterno' => 'sometimes|required|string|max:255',
            'Personas_correo' => 'sometimes|required|string|email|max:255',
            'Personas_usuario' => 'sometimes|required|string|max:255',
            'Personas_contrasena' => 'sometimes|nullable|string|min:8',
            // Se recomienda que 'usuario_idRol' use 'sometimes|required' si no siempre se envía,
            // pero se mantiene 'required' según tu código original.
            'usuario_idRol' => 'required',
        ]);

        if ($validator->fails()) {
            // Retorna 400 Bad Request con los errores de validación
            return response()->json($validator->errors(), 400);
        }

        // 3. Llenar el resto de los campos excluyendo la contraseña (para que se hashee correctamente)
        // El método fill() debe ir antes del check isDirty() para que el modelo tenga los nuevos valores.
        // Además, $request->except() solo debe excluir la contraseña.
        $user->fill($request->except('Personas_contrasena'));

        $menusToAttach = []; // Inicializamos la variable

        // 4. Manejar actualización de permisos si el rol ha cambiado
        if ($user->isDirty('usuario_idRol')) {
            // Obtenemos el nuevo rol y sus menús
            $nuevoRol = Roles::find($user->usuario_idRol); // Usamos el valor ya asignado al modelo

            if ($nuevoRol) {
                // Recolectar solo los IDs de los menús del nuevo rol
                $nuevosMenus = collect($nuevoRol->menus)->map(fn($m) => $m['menu_id']);

                // Eliminar los menús/permisos antiguos para el usuario
                UserxMenu::where('usuarioxmenu_idusuario', $id)->delete();

                // Preparar los menús a adjuntar
                foreach ($nuevosMenus as $menuId) {
                    // El campo clave del array asociativo debe ser el ID del menú para el attach
                    $menusToAttach[$menuId] = [
                        'usuarioxmenu_alta' => 1,
                        'usuarioxmenu_especial' => 0,
                        'usuarioxmenu_cambio' => 1,
                        'usuarioxmenu_consulta' => 1,
                    ];
                }
            }
        }

        // 5. Manejar la actualización de la contraseña por separado
        if ($request->filled('Personas_contrasena')) {
            $user->Personas_contrasena = $request->Personas_contrasena;
        }

        // 6. Guardar los cambios en el usuario
        $user->save(); // Persiste todos los cambios (incluyendo el nuevo rol y la contraseña hasheada)

        // 7. Adjuntar los nuevos menús si el rol cambió
        // **CORRECCIÓN CRÍTICA:** Usamos la variable $user (el modelo persistido) en lugar de la variable no definida $usuario
        if (!empty($menusToAttach)) {
            // Asegúrate de que la relación 'menus()' esté definida en el modelo User
            $user->menus()->attach($menusToAttach);
        }

        // 8. Retorno de la respuesta
        return response()->json([
            'message' => 'Usuario actualizado exitosamente',
            'user' => $user
        ], 200); // Retorna 200 OK
    }
    public function menus(Request $request, $id) // Lo inyectas directamente aquí    
    {
        $user = User::where('Personas_usuarioID', $id)
            ->with('menus') // <--- Aquí estaba el error: se necesita usar ()
            ->first();

        if (!$user) {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }

        // Obtener y filtrar menús
        $menusData = $user->menus()
            ->orderBy('menu_nombre')
            ->get()
            ->map(fn($menu) => $menu->toArray());

        $menus = [];
        $menusMap = [];
        $processedMenus = []; // Array para controlar menús procesados y evitar duplicados

        // Crear un mapa de menús
        foreach ($menusData as $menu) {
            $menu['childs'] = []; // Ahora sí podemos modificarlo porque es un array
            $menusMap[$menu['menu_id']] = $menu;
        }

        // Construir jerarquía de menús
        foreach ($menusData as $menu) {
            // Verificar si el menú ya ha sido procesado para evitar duplicados
            if (in_array($menu['menu_id'], $processedMenus)) {
                continue; // Si ya fue procesado, lo saltamos
            }

            if ($menu['menu_idPadre'] == 0) {
                $menus[] = &$menusMap[$menu['menu_id']];
            } else {
                $menusMap[$menu['menu_idPadre']]['childs'][] = &$menusMap[$menu['menu_id']];
            }

            // Marcar el menú como procesado
            $processedMenus[] = $menu['menu_id'];
        }

        return response()->json($menus, 200);
    }
}
